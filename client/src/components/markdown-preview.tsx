"use client"

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs, atomDark, dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { Check, Copy, Code } from "lucide-react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  noHighlight?: boolean;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  className,
  noHighlight = false,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Add state for tracking copied code blocks
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
	<div className={cn(
		'markdown-preview text-sm leading-relaxed text-foreground',
		'prose dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight',
		'prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
		'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none',
		'prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground/30 prose-blockquote:pl-4 prose-blockquote:italic',
		'prose-img:rounded-md prose-img:mx-auto',
		'prose-hr:border-muted',
		'prose-table:border prose-table:border-collapse prose-table:border-border',
		'prose-th:bg-muted/50 prose-th:p-2 prose-th:border prose-th:border-border',
		'prose-td:p-2 prose-td:border prose-td:border-border',
		'prose-li:marker:text-muted-foreground',
		'max-w-none',
		'leading-relaxed',
		className
	)}
	>
		<ReactMarkdown
		remarkPlugins={[remarkGfm]}
		rehypePlugins={[rehypeRaw]}
		components={{
			h1: ({ children, ...props }) => (
				<h1 className="text-2xl font-semibold mb-4 mt-6 text-foreground/90 italic font-serif" {...props}>
				{children}
			</h1>
			),
			h2: ({ children, ...props }) => (
			<h2 className="text-xl font-medium mb-3 mt-5 text-foreground/90 font-serif" {...props}>
				{children}
			</h2>
			),
			h3: ({ children, ...props }) => (
				<h3 className="text-lg font-medium mb-2 mt-4 text-foreground/90" {...props}>
				{children}
			</h3>
			),
			p: ({ children, ...props }) => (
			<p className="mb-4" {...props}>
				{children}
			</p>
			),
			a: ({ children, href, ...props }) => {
				// Clean URL from encoded special characters at the beginning and end
				const cleanHref = href ? (() => {
					try {
						// First decode the URL
						let decodedHref = decodeURIComponent(href.trim());
						
						// Remove common problematic characters from beginning and end
						// %60 (backtick), %5B ([), %5D (])
						decodedHref = decodedHref
							.replace(/^[`\[\]]+|[`\[\]]+$/g, '') // Remove backticks, brackets from start/end
							.trim();
						
						return decodedHref || '#';
					} catch (e) {
						// If decoding fails, use simpler approach
						return href.trim().replace(/%60|%5B|%5D/g, '') || '#';
					}
				})() : '#';
				
				return (
					<Link 
						href={cleanHref} 
						target={'_blank'} 
						rel={cleanHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
						className={cn("text-emerald-500/95 hover:underline transition-colors", "text-primary font-medium")}
						{...props}
					>
						{children}
					</Link>
				);
			},
			img: ({ src, alt, ...props }) => (
			<div className="my-4 flex justify-center">
				{typeof src === 'string' && src && (
				src.startsWith('http') ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={src}
						alt={alt || ''}
						className="rounded-lg max-h-96 object-contain"
						loading="lazy"
						{...props}
					/>
				) : (
					<Image
						src={src}
						alt={alt || ''}
						className="rounded-lg max-h-96 object-contain"
						{...props}
						width={600}
						height={400}
					/>
				)
				)}
			</div>
			),
			code: ({ node, className, children, ...props }) => {
			  const match = /language-(\w+)/.exec(className || '');
			  const language = match && match[1] ? match[1] : '';
			  
			  // More reliable inline code detection
			  const isInline = !className || !language
			  
			  if (isInline && !className) {
				return (
				  <code className="bg-muted/70 px-1.5 py-0.5 rounded-md text-sm font-mono break-words whitespace-pre-wrap overflow-x-auto inline-block max-w-full" {...props}>
					{children}
				  </code>
				);
			  }
			  
			  // Get the code content as a string
			  const codeContent = String(children).replace(/\n$/, '');
			  const isCopied = copiedCode === codeContent;
			  
			  // Code block with improved overflow handling and added language header + copy button
			  return (
			    <div className="my-4 overflow-hidden rounded-lg border bg-muted">
			      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted">
			        <div className="flex items-center gap-2">
			          <Code size={16} className="text-muted-foreground" />
			          <span className="text-xs font-medium text-muted-foreground">
			            {language || 'plain text'}
			          </span>
			        </div>
			        <button
			          onClick={() => handleCopyCode(codeContent)}
			          className="h-7 w-7 flex items-center justify-center rounded-md transition-colors hover:bg-accent cursor-pointer"
			          title="Copy code"
			        >
			          {isCopied ? (
			            <Check size={16} className="text-green-500" />
			          ) : (
			            <Copy size={16} className="text-muted-foreground" />
			          )}
			        </button>
			      </div>
			      <div className="relative w-full overflow-auto break-words">
			        <SyntaxHighlighter
			          language={language || 'text'}
			          style={(isDark ? atomDark : vs) as any}
			          customStyle={{
			            margin: 0,
			            borderRadius: 0, // Remove border radius since the parent has it
			            fontSize: '0.875rem',
			            maxWidth: '100%',
			          }}
			          wrapLongLines={true}
			          showLineNumbers={false}
			          {...props as any}
			        >
			          {codeContent}
			        </SyntaxHighlighter>
			      </div>
			    </div>
			  );
			},
			ul: ({ children, ...props }) => (
			<ul className="list-disc pl-6 mb-4 space-y-1.5" {...props}>
				{children}
			</ul>
			),
			ol: ({ children, ...props }) => (
			<ol className="list-decimal pl-6 mb-4 space-y-1.5" {...props}>
				{children}
			</ol>
			),
			li: ({ children, ...props }) => (
			<li className="mb-1" {...props}>
				{children}
			</li>
			),
			blockquote: ({ children, ...props }) => (
			<blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-4 text-muted-foreground" {...props}>
				{children}
			</blockquote>
			),
			hr: (props) => <hr className="my-6 border-muted" {...props} />,
			table: ({ children, ...props }) => (
			<div className="overflow-x-auto my-6">
				<table className="min-w-full border border-border rounded-md overflow-hidden" {...props}>
				{children}
				</table>
			</div>
			),
			thead: ({ children, ...props }) => (
			<thead className="bg-muted/50" {...props}>
				{children}
			</thead>
			),
			th: ({ children, ...props }) => (
			<th className="py-2 px-3 text-left font-medium border-b border-border" {...props}>
				{children}
			</th>
			),
			td: ({ children, ...props }) => (
			<td className="py-2 px-3 border-t border-border" {...props}>
				{children}
			</td>
			),
			pre: ({ children, ...props }) => (
			<pre className="my-4 rounded-lg overflow-hidden bg-transparent p-0" {...props}>
				{children}
			</pre>
			),
		}}
		>
		{content || ''}
		</ReactMarkdown>
	</div>
  );
};

export default MarkdownPreview;