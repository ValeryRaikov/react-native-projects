import { upload } from "cloudinary-react-native";
import { cld } from "~/src/lib/clodinary";
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params";

export const uploadImage = async (file: string) => {
    const options = {
        upload_preset: 'instagram',
        unsigned: true,
    }

    return new Promise<UploadApiResponse>(async (resolve, reject) => {
        await upload(cld, {
            file, 
            options: options, 
            callback: (error: any, response: any) => {
                if (error || !response)
                    reject(response);
                else 
                    resolve(response);
        }})
    });
}