import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Highlight, themes } from 'prism-react-renderer';

const languages = {
  javascript: 'javascript',
  js: 'javascript',
  jsx: 'jsx',
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'tsx',
  python: 'python',
  py: 'python',
  css: 'css',
  scss: 'scss',
  html: 'html',
  xml: 'xml',
  json: 'json',
  yaml: 'yaml',
  markdown: 'markdown',
  md: 'markdown',
  bash: 'bash',
  shell: 'shell',
  sql: 'sql',
  graphql: 'graphql',
  rust: 'rust',
  go: 'go',
  java: 'java',
  kotlin: 'kotlin',
  swift: 'swift',
  ruby: 'ruby',
  php: 'php',
  csharp: 'csharp',
  c: 'c',
  cpp: 'cpp',
};

const CodeBlock = ({ children, className, showLineNumbers = true }) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];
  const language = languages[lang] || 'text';

  // Get initial dark mode state synchronously
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
    // Only set up observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="rounded-lg overflow-hidden my-4">
      <Highlight
        theme={isDark ? themes.tomorrow : themes.github}
        code={String(children).trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className="origin-left">
            <pre className={className + ' p-4 overflow-auto text-sm'} style={style}>
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  className={showLineNumbers ? 'table-row' : undefined}
                >
                  {showLineNumbers && (
                    <span className="table-cell pr-4 text-gray-500 select-none text-right text-sm">
                      {i + 1}
                    </span>
                  )}
                  <span className={showLineNumbers ? 'table-cell' : undefined}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
};

const EditorTab = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      px-6 py-2.5 font-semibold text-sm
      first:rounded-l-lg last:rounded-r-lg
      border-y-2 border-r-2 first:border-l-2
      transition-all duration-200
      ${active
        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-500 relative z-10 shadow-sm transition-none'
        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-none'
      }
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
    `}
  >
    {children}
  </button>
);

const defaultPlaceholder = `Write your content here... Supports Markdown formatting!

# Formatting Guide:
- Use blank lines for paragraphs
- **bold** or *italic* text
- Lists with - or 1.
- Tables with | separator
- \`inline code\` with backticks
- Code blocks with language:

\`\`\`javascript
// Code blocks with syntax highlighting
const hello = "world";
console.log(hello);
\`\`\``;

const MarkdownEditor = ({
  content,
  onChange,
  disabled = false,
  rows = 16,
  preview = true,
  placeholder = defaultPlaceholder,
  showLineNumbers = true
}) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!preview) {
    return (
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="[field-sizing:content] w-full px-4 py-2 rounded-lg 
                 bg-white dark:bg-gray-800 
                 text-gray-900 dark:text-white 
                 border-2 border-gray-200 dark:border-gray-700
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 disabled:opacity-50 disabled:cursor-not-allowed
                 font-mono text-sm
                 min-h-[6rem]
                 [&::placeholder]:text-gray-500 dark:[&::placeholder]:text-gray-400
                 transition-[background,color,border] duration-0"
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex mb-3 -space-x-px">
        <EditorTab
          active={!showPreview}
          onClick={() => setShowPreview(false)}
        >
          Write
        </EditorTab>
        <EditorTab
          active={showPreview}
          onClick={() => setShowPreview(true)}
        >
          Preview
        </EditorTab>
      </div>

      <div className="relative">
        {showPreview ? (
          <div className="p-4 min-h-[24rem] prose dark:prose-invert max-w-none 
                       bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 
                       dark:border-gray-700 overflow-auto shadow-sm">
            <div className="text-gray-900 dark:text-gray-100">
              <MarkdownPreview content={content} showLineNumbers={showLineNumbers} />
            </div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="[field-sizing:content] w-full px-4 py-2 rounded-lg
                     bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-white 
                     border-2 border-gray-200 dark:border-gray-700
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm
                     font-mono text-sm
                     resize-y min-h-[24rem]
                     [&::placeholder]:text-gray-500 dark:[&::placeholder]:text-gray-400
                     transition-[background,color,border] duration-0"
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

export const MarkdownPreview = ({ content, showLineNumbers = true }) => {
  // Preprocess content to handle inline code
  const processedContent = () => {
    // Replace inline code with HTML markup
    return content.replace(/(?<!`)`([^`\n]+)`(?!`)/g, '<span class="custom-inline-code">$1</span>');
  };

  // CSS for the custom inline code
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'inline-code-css';
    style.textContent = `
      .custom-inline-code {
        display: inline;
        background-color: #f3f4f6;
        padding: 0.1rem 0.4rem;
        border-radius: 0.25rem;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.875rem;
        color: #111827;
        white-space: normal;
      }
      
      .dark .custom-inline-code {
        background-color: #374151;
        color: #ffffff;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.getElementById('inline-code-css')?.remove();
    };
  }, []);

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]} // This is critical to parse the HTML in our preprocessed content
      components={{
        // Only handle code blocks here
        code({ node, inline, className, children, ...props }) {
          if (inline) {
            // We're already handling inline code via preprocessing
            return null;
          }
          return <CodeBlock className={className} showLineNumbers={showLineNumbers}>{children}</CodeBlock>;
        },
        // Rest of your components remain the same
        p: ({ children }) => (
          <p className="mb-4 last:mb-0 leading-relaxed text-gray-900 dark:text-gray-100">{children}</p>
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-white">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900 dark:text-white">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold mb-3 mt-4 text-gray-900 dark:text-white">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-4 text-gray-900 dark:text-gray-100">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-4 text-gray-900 dark:text-gray-100">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="mb-1 text-gray-900 dark:text-gray-100">{children}</li>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 
                     dark:hover:text-blue-300 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 
                                pl-4 my-4 italic text-gray-900 dark:text-gray-100">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
            {children}
          </td>
        ),
      }}
    >
      {processedContent()}
    </ReactMarkdown>
  );
};

export default MarkdownEditor;