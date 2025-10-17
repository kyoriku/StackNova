import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';
import { Copy, Check } from 'lucide-react';

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

const CodeBlock = ({ children, className, showLineNumbers = false }) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];
  const language = languages[lang] || 'text';

  let code = String(children).trim();
  if (code.endsWith('```')) {
    code = code.slice(0, -3);
  }

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed: ', err);
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
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

  const modifiedVsLight = {
    ...themes.vsLight,
    plain: {
      ...themes.vsLight.plain,
      backgroundColor: '#f6f8fa'
    }
  };

  const modifiedVsDark = {
    ...themes.vsDark,
    plain: {
      ...themes.vsDark.plain,
      // backgroundColor: '#0d1117'
      backgroundColor: '#141b24'
    }
  };

  return (
    <div className="relative rounded-md overflow-hidden my-4 border border-gray-200 dark:border-gray-700/60">
      <button
        type="button"
        onClick={copyToClipboard}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-md
                 bg-transparent hover:bg-gray-700/20 dark:hover:bg-gray-600/30
                 text-gray-500 hover:text-gray-700 
                 dark:text-gray-400 dark:hover:text-gray-200 
                 transition-colors duration-150 
                 focus:outline-none cursor-pointer"
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <Check size={16} className="text-green-500 dark:text-green-400" />
        ) : (
          <Copy size={16} />
        )}
      </button>

      <Highlight
        theme={isDark ? modifiedVsDark : modifiedVsLight}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className="origin-left">
            <pre className={className + ' p-4 overflow-auto text-[85%] leading-6'} style={style}>
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
      relative px-6 py-2.5 font-semibold text-sm mb-2 
      transition-all duration-200 cursor-pointer dark:focus:ring-blue-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 
      ${active
        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl z-10 shadow-sm'
        : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
      }
    `}
  >
    {children}
  </button>
);

const defaultPlaceholder = `Write your content here... Supports Markdown formatting!

# Formatting examples:
- Use blank lines for paragraphs
- **bold** or *italic* text
- Lists with - or 1.
- Tables with | separator
- \`inline code\` with backticks
- Code blocks with language:

\`\`\`javascript
const greeting = "Hello, world!";
console.log(greeting);
\`\`\``;

const MarkdownEditor = ({
  content,
  onChange,
  disabled = false,
  rows = 16,
  preview = true,
  placeholder = defaultPlaceholder,
  showLineNumbers = false,
  previewClassName = "",
  minHeight = "24rem"
}) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!preview) {
    return (
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="[field-sizing:content] w-full px-4 py-3 rounded-xl
                 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                 text-gray-900 dark:text-gray-100 
                 border-2 border-gray-200 dark:border-gray-700
                 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
                 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                 disabled:opacity-50 disabled:cursor-not-allowed
                 font-mono text-sm
                 min-h-[6rem]
                 shadow-sm shadow-gray-900/5 dark:shadow-black/20
                 placeholder:text-gray-500 dark:placeholder:text-gray-400
                 transition-all duration-200"
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-2">
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
          <div
            style={{ minHeight }}
            className={previewClassName || `p-4 mb-4.5 sm:p-6 max-w-none 
                       bg-gradient-to-br from-white to-gray-50/50 
                       dark:from-gray-800 dark:to-gray-800/50
                       rounded-xl
                       border-2 border-gray-200 dark:border-gray-700
                       overflow-auto 
                       shadow-sm shadow-gray-900/5 dark:shadow-black/20
                       font-sans text-[16px] leading-6 text-gray-900 dark:text-gray-100`}>
            <MarkdownPreview content={content} showLineNumbers={showLineNumbers} />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            style={{ minHeight }}
            className="[field-sizing:content] w-full px-4 py-3
                     bg-gradient-to-br from-white to-gray-50/50 
                     dark:from-gray-800 dark:to-gray-800/50
                     text-gray-900 dark:text-gray-100 
                     border-2 border-gray-200 dark:border-gray-700
                     rounded-xl
                     focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                     focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm shadow-gray-900/5 dark:shadow-black/20
                     font-mono text-sm
                     resize-y
                     placeholder:text-gray-500 dark:placeholder:text-gray-400
                     transition-all duration-200"
            placeholder={placeholder}
            disabled={disabled}
            required
            aria-required="true"
          />
        )}
      </div>
    </div>
  );
};

export const MarkdownPreview = ({ content, showLineNumbers = false }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'inline-code-css';
    style.textContent = `
      /* Remove bottom margin from nested lists */
      .markdown-list .markdown-list {
        margin-bottom: 0;
      }

      .markdown-list .markdown-list li:first-child {
        margin-top: 0;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.getElementById('inline-code-css')?.remove();
    };
  }, []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const hasNewlines = String(children).includes('\n');
          const isInline = !className && !hasNewlines;

          if (isInline) {
            return (
              <code className="inline bg-gray-200/60 dark:bg-gray-700 px-[0.4em] py-[0.2em] rounded-md font-mono text-[85%] text-gray-900 dark:text-gray-100">
                {children}
              </code>
            );
          }
          return <CodeBlock className={className} showLineNumbers={showLineNumbers}>{children}</CodeBlock>;
        },
        p: ({ children }) => (
          <p className="mb-4 text-[16px]">{children}</p>
        ),
        h1: ({ children }) => (
          <h1 className="text-[2em] font-semibold pb-2 mb-4 mt-6 first:mt-0 border-b border-gray-300 dark:border-gray-700">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-[1.5em] font-semibold pb-2 mb-4 mt-6 first:mt-0 border-b border-gray-300 dark:border-gray-700">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[1.25em] font-semibold mb-4 mt-6 first:mt-0">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-[1em] font-semibold mb-4 mt-6 first:mt-0">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-[0.875em] font-semibold mb-4 mt-6 first:mt-0">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-[0.85em] font-semibold mb-4 mt-6 first:mt-0 text-gray-600 dark:text-gray-400">{children}</h6>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="markdown-list list-disc pl-8 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="markdown-list list-decimal pl-8 mb-4">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="mt-1">{children}</li>
        ),
        input: ({ type, checked, disabled }) => {
          if (type === 'checkbox') {
            return (
              <input
                type="checkbox"
                checked={checked}
                disabled
                className="mr-2 align-middle"
              />
            );
          }
          return null;
        },
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-[#0969da] hover:underline dark:text-[#2f81f7]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-[0.25em] border-gray-300 dark:border-gray-600 
                                pl-4 my-4 text-gray-600 dark:text-gray-400">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="border-collapse w-full">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-white dark:bg-gray-900">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-t border-gray-300 dark:border-gray-700">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 border border-gray-300 dark:border-gray-700">
            {children}
          </td>
        ),
        hr: () => (
          <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownEditor;