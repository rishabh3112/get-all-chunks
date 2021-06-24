import glob from "glob-promise";

export const getAllFiles = async (cwd = process.cwd()) => {
    return await glob(cwd + "/**/*.(js|ts|tsx)");
}