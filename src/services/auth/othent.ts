import { Othent, AppInfo, } from '@othent/kms';

const appInfo: AppInfo = {
    name: "aostore",
    version: "1.0.0",
    env: "production",
};

export const initializeOthent = () => {
    const othent = new Othent({ appInfo });

    return othent;
};
