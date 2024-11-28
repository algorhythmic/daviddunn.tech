import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type { ReactNode } from 'react';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import cn from 'classnames';
import Image from 'next/image';

interface CodeBlockProps {
  language: string;
  value: string;
}

type ComponentType = {
  children?: ReactNode;
  className?: string;
  href?: string;
  inline?: boolean;
}

const CodeBlock = ({ language, value }: CodeBlockProps) => {
  return (
    <SyntaxHighlighter language={language} style={oneDark}>
      {value}
    </SyntaxHighlighter>
  );
};

const MarkdownRenderer = ({ content, className }: { content: string; className?: string }) => {
  const components: Partial<Components> = {
    code(props: ComponentType) {
      const { inline, className, children } = props;
      const match = /language-(\w+)/.exec(className || '');

      if (inline) {
        return <code className="bg-muted px-1 py-0.5 rounded">{children}</code>;
      }

      return (
        <CodeBlock
          language={match ? match[1] : ''}
          value={String(children).replace(/\n$/, '')}
        />
      );
    },
    h1(props: ComponentType) {
      return <h1 className="text-4xl font-bold mb-4">{props.children}</h1>;
    },
    h2(props: ComponentType) {
      return <h2 className="text-3xl font-bold mt-8 mb-4">{props.children}</h2>;
    },
    h3(props: ComponentType) {
      return <h3 className="text-2xl font-bold mt-6 mb-3">{props.children}</h3>;
    },
    h4(props: ComponentType) {
      return <h4 className="text-xl font-bold mb-2">{props.children}</h4>;
    },
    h5(props: ComponentType) {
      return <h5 className="text-lg font-bold mb-1">{props.children}</h5>;
    },
    h6(props: ComponentType) {
      return <h6 className="text-base font-bold mb-1">{props.children}</h6>;
    },
    a(props: ComponentType) {
      const { href, children } = props;
      return (
        <a
          href={href}
          className="text-primary hover:underline"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      );
    },
    ul(props: ComponentType) {
      return <ul className="list-disc pl-6 my-4">{props.children}</ul>;
    },
    ol(props: ComponentType) {
      return <ol className="list-decimal pl-6 my-4">{props.children}</ol>;
    },
    img(props: { src?: string; alt?: string }) {
      if (!props.src) return null;
      
      return (
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={props.src}
            alt={props.alt || ''}
            fill
            className="rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            priority={false}
          />
        </div>
      );
    },
  };

  return (
    <ReactMarkdown
      className={cn("prose dark:prose-invert max-w-none", className)}
      remarkPlugins={[remarkGfm, remarkToc]}
      rehypePlugins={[rehypeSlug, rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
