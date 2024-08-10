import localFont from "@next/font/local";
import { Poppins } from '@next/font/google';

export const poppins = Poppins({
    weight: ['400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});

export const uberMoveText = localFont({
    src: [
        {
            path: '../public/fonts/UberMoveTextLight.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../public/fonts/UberMoveTextRegular.otf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/UberMoveTextMedium.otf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/UberMoveTextBold.otf',
            weight: '700',
            style: 'normal',
        },
    ],
});