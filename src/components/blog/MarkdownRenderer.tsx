import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import cn from 'classnames';

interface CodeBlockProps {
  language: string;
  value: string;
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const CodeBlock = ({ language, value }: CodeBlockProps) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{ margin: 0 }}
    >
      {value}
    </SyntaxHighlighter>
  );
};

const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const components = {
    code: ({ inline, className, children }: { inline?: boolean; className?: string; children: React.ReactNode }) => {
      if (inline) {
        return <code className="bg-muted px-1 py-0.5 rounded">{children}</code>;
      }

      const match = /language-(\w+)/.exec(className || "");
      const lang = match ? match[1] : "";

      return (
        <CodeBlock
          language={lang}
          value={String(children).replace(/\n$/, "")}
        />
      );
    },
    // Customize heading styles
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>
    ),
    // Customize link styles
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    // Customize list styles
    ul: ({ children }) => (
      <ul className="list-disc pl-6 my-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 my-4">{children}</ol>
    ),
  };

  return (
    <ReactMarkdown
      className={cn("prose prose-lg dark:prose-invert max-w-none", className)}
      components={components}
      remarkPlugins={[remarkGfm, remarkToc]}
      rehypePlugins={[rehypeSlug, rehypeHighlight]}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
