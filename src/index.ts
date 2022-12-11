import { readFile } from 'fs'
import StorageBase from 'ghost-storage-base'
import got from 'got'
import ImageKit from 'imagekit'
import { join, parse } from 'path'

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
        const filePath = stripLeadingSlash(join(targetDir || "", fileName));
        const response = await got(new URL(filePath, this.urlEndpoint), {
            responseType: 'buffer',
            resolveBodyOnly: true
        })
        if (response) return true
        return false;
    }

    async save(image: StorageBase.Image, targetDir?: string): Promise<string> {
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
        return (req: Express.Request, res: Express.Response, next: () => void) => {
            next();
        };
    }

    async delete(fileName: string, targetDir?: string): Promise<boolean> {
        throw new Error("Currently deleting a file by path is not possible via API.")
    }

    async read(options?: StorageBase.ReadOptions): Promise<Buffer> {
        return await got(new URL(options?.path || "", this.urlEndpoint), {
            responseType: 'buffer',
            resolveBodyOnly: true
        })
    }
}

export default Store
module.exports = Store