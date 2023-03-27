import  {join} from 'path'

export function sampleConfig() {
    return {
        auth: {
            urlEndpoint: 'http://ik.imagekit.io/ghostTesting/',
            privateKey: 'testing',
            publicKey: 'testing'
        },
        uploadOptions: {
            useUniqueFileName: true,
            folder: '/',
            tags: []
        }
    }
}

export const mockImage = {
    name: 'mockImage.png',
    targetDir : 'testFolder'
}

export const mockInexistentImage = {
    name: 'mockInexistentImage.png',
    targetDir: 'testFolder'
}

export const image = {
    name: 'test_image.jpg',
    path: join(__dirname, './data/test_image.jpg'),  
}
