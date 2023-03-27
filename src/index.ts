import { readFile } from 'fs'
import StorageBase from 'ghost-storage-base'
import got from 'got'
import ImageKit from 'imagekit'
import { join, parse } from 'path'
import serveStatic from 'serve-static'
const fileServe = serveStatic(join(process.env.GHOST_CONTENT as string, "images"), {
    fallthrough: true,
    maxAge: "1y"
});

const readFileAsync = (fp: string): Promise<Buffer> => new Promise((resolve, reject) => readFile(fp, (err, data) => err ? reject(err) : resolve(data)))
const stripLeadingSlash = (s: string) => s.indexOf('/') === 0 ? s.substring(1) : s

export interface ImageKitStoreConfig {
    auth: {
        urlEndpoint: string
        privateKey: string
        publicKey: string
    }
    uploadOptions: {
        useUniqueFileName?: boolean
        tags?: string[]
        folder?: string
    }
}

class Store extends StorageBase {
    private urlEndpoint: string;
    private privateKey: string;
    private publicKey: string;
    private uploadOptions: ImageKitStoreConfig["uploadOptions"]
    private _imagekit: ImageKit

    constructor(config: ImageKitStoreConfig) {
        // @ts-ignore
        super(config)

        const {
            auth,
            uploadOptions = {}
        } = config

        const {
            urlEndpoint = process.env.IMAGEKIT_STORE_URL_ENDPOINT,
            privateKey = process.env.IMAGEKIT_STORE_PRIVATE_KEY,
            publicKey = process.env.IMAGEKIT_STORE_PUBLIC_KEY
        } = auth || {};

        const {
            useUniqueFileName = true,
            tags = [],
            folder = '/'
        } = uploadOptions;

        this.urlEndpoint = urlEndpoint ?? "";
        this.privateKey = privateKey ?? "";
        this.publicKey = publicKey ?? "";
        this.uploadOptions = {
            useUniqueFileName: (useUniqueFileName.toString() === "false" || useUniqueFileName === false) ? false : true,
            tags,
            folder: folder
        };

        this._imagekit = new ImageKit({
            urlEndpoint: this.urlEndpoint,
            publicKey: this.publicKey,
            privateKey: this.privateKey
        })
    }

    async exists(fileName: string, targetDir?: string): Promise<boolean> {
        console.log("exists", fileName, targetDir)
        const filePath = stripLeadingSlash(join(targetDir || "", fileName));
        try {
        const response = await got(new URL(filePath, this.urlEndpoint), {
            responseType: 'buffer',
            resolveBodyOnly: true
        })
        console.log("res",response)
        return true
        } catch {
            return false;
        }
    }

    async save(image: StorageBase.Image, targetDir?: string): Promise<string> {
        console.log("save", image.name)
        const folder = targetDir || this.getTargetDir(this.uploadOptions.folder)
        const fileName = this.getSanitizedFileName(image.name);

        const file = await readFileAsync(image.path);

        const uploadResponse = await this._imagekit.upload({
            file,
            fileName,
            useUniqueFileName: this.uploadOptions.useUniqueFileName,
            folder,
            tags: this.uploadOptions.tags
        })

        var result = new URL(uploadResponse.url)
        result.searchParams.append("updatedAt", new Date().getTime().toString())
        return result.toString()
    }

    serve() {
        return (req: any, res: any, next: any) => {
            console.log("serve", req.url)
            fileServe(req, res, () => {
                console.log("file not found")
                res.status(404).end();
            });
        };
    }

    async delete(fileName: string, targetDir?: string): Promise<boolean> {
        console.log("delete", fileName, targetDir)
        throw new Error("Currently deleting a file by path is not possible via API.")
    }

    async read(options?: StorageBase.ReadOptions): Promise<Buffer> {
        console.log("Read", options)
        return await got(new URL(options?.path || "", this.urlEndpoint), {
            responseType: 'buffer',
            resolveBodyOnly: true
        })
    }
}

export default Store
module.exports = Store