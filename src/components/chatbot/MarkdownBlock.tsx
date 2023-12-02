// Library imports
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';
import 'prismjs/themes/prism.css';
// Custom imports
import TextCopyButton from "@/components/TextCopyButton";

type MarkdownBlockPros = {
    content: string
};

const MarkdownBlock:React.FC<MarkdownBlockPros> = ({ content }) => {

    // Add the CodeCopyBtn component to our PRE element
    const Pre: React.FC<{ children: any }> = ({ children }) => {
        const text = children[0].props.children[0];
        return (
            <pre className="code-block">
              <TextCopyButton getText={() => text} className="absolute top-4 right-4" />
              {children}
            </pre>
        );
    }

    return (
        // If you update the "react-markdown": "^8.0.7" (see package.json) to a
        // later version it will break the existing functionality (e.g., 
        // linkTarget is removed and many more changes)
        <ReactMarkdown className='post-markdown'
                       linkTarget='_blank'
            rehypePlugins={[]} // Add rehype plugins (e.g., rehypeRaw) to the array as needed
            remarkPlugins={[remarkGfm]} // Add remark plugins (e.g., remarkGfm) to the array as needed
            components={{pre: Pre,
                        code({ node, inline, className="bg-cyan-600 text-white", children, ...props }) {
                            const languageMatch = /language-(\w+)/.exec(className || '')
                            return (!inline && languageMatch) ? (
                                <SyntaxHighlighter {...props}
                                                   style={prism}
                                                   language={languageMatch[1]}
                                                   PreTag="div"
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                            )
                        }
            }}
        >
          {content}
        </ReactMarkdown>
    )
}
export default MarkdownBlock;