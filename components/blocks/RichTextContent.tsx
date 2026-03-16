"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ReactMarkdown from "react-markdown";

const proseBase =
  "text-foreground leading-relaxed " +
  "[&_p]:mb-4 " +
  "[&_a]:text-[hsl(84_55%_45%)] [&_a]:underline-offset-4 hover:[&_a]:underline " +
  "[&_strong]:font-semibold [&_em]:italic [&_u]:underline " +
  "[&_h1]:text-3xl [&_h1]:font-heading [&_h1]:font-black [&_h1]:mb-4 " +
  "[&_h2]:text-2xl [&_h2]:font-heading [&_h2]:font-black [&_h2]:mb-3 " +
  "[&_h3]:text-xl [&_h3]:font-heading [&_h3]:font-black [&_h3]:mb-3 " +
  "[&_h4]:text-lg [&_h4]:font-heading [&_h4]:font-black [&_h4]:mb-2 " +
  "[&_h5]:text-base [&_h5]:font-heading [&_h5]:font-black [&_h5]:mb-2 " +
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 " +
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 " +
  "[&_li]:mb-2 " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-[hsl(84_55%_45%)] [&_blockquote]:pl-4 [&_blockquote]:text-[hsl(0_0%_40%)]";

export default function RichTextContent({ body }: { body?: unknown }) {
  if (!body) return null;

  if (typeof body === "string") {
    return (
      <div className={proseBase}>
        <ReactMarkdown
          components={{
            a: ({ children, ...props }) => (
              <a {...props} className="text-[hsl(84_55%_45%)] hover:underline">
                {children}
              </a>
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={proseBase}>
      <BlocksRenderer
        content={body as any}
        blocks={{
          paragraph: ({ children }) => <p>{children}</p>,
          heading: ({ children, level }) => {
            const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements;
            return <Tag>{children}</Tag>;
          },
          list: ({ children, format }) =>
            format === "ordered" ? <ol>{children}</ol> : <ul>{children}</ul>,
          "list-item": ({ children }) => <li>{children}</li>,
          quote: ({ children }) => <blockquote>{children}</blockquote>,
          code: ({ plainText }) => (
            <pre className="bg-[hsl(80_30%_93%)] rounded-xl p-4 overflow-x-auto">
              <code>{plainText}</code>
            </pre>
          ),
          link: ({ children, url }) => (
            <a href={url} className="text-[hsl(84_55%_45%)] hover:underline">
              {children}
            </a>
          ),
        }}
        modifiers={{
          bold: ({ children }) => <strong>{children}</strong>,
          italic: ({ children }) => <em>{children}</em>,
          underline: ({ children }) => <u>{children}</u>,
        }}
      />
    </div>
  );
}
