import "@/styles/globals.css";
import {Metadata, Viewport} from "next";
import {Link} from "@nextui-org/link";
import clsx from "clsx";

import {Providers} from "./providers";

import {siteConfig} from "@/config/site";
import {fontSans} from "@/config/fonts";
import {Navbar} from "@/components/navbar";
import Script from "next/script";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "white"},
        {media: "(prefers-color-scheme: dark)", color: "black"},
    ],
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning lang="en">
        <head>
            <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-8RLFK818BF"
            ></Script>
            <Script id="google-analytics">
                {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-8RLFK818BF');
          `}
            </Script>
            <Script>
                {`
               (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-WGLX37W3');
            `}
            </Script>
        </head>
        <body
            className={clsx(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable,
            )}
        >
        <Providers themeProps={{attribute: "class", defaultTheme: "light"}}>
            <div className="relative">
                <noscript
                    dangerouslySetInnerHTML={{
                        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-xxxx" height="0" width="0" style="display: none; visibility: hidden;" />`,
                    }}
                />

                <Navbar/>
                <main className="container mx-auto max-w-7xl px-2 py-4 sm:py-6 flex-grow">
                    {children}
                </main>
                {/*<footer className="w-full flex items-center justify-center py-3">*/}
                {/*  <Link*/}
                {/*    isExternal*/}
                {/*    className="flex items-center gap-1 text-current"*/}
                {/*    href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"*/}
                {/*    title="nextui.org homepage"*/}
                {/*  >*/}
                {/*    <span className="text-default-600">Powered by</span>*/}
                {/*    <p className="text-primary">NextUI</p>*/}
                {/*  </Link>*/}
                {/*</footer>*/}
            </div>
        </Providers>
        </body>
        </html>
    );
}
