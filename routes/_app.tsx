import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const resp = await ctx.render();
    resp.headers.set("Cache-Control", "max-age=31536000, immutable");
    return resp;
  },
};
export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta name="theme-color" content="E0E0E0"/>
        <meta name="description" content="Hello world!" />
        <link rel="shortcut icon" href="/images/favicon.svg" type="image/svg" />
      </Head>
      <props.Component/>
    </>
  );
}