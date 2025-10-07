import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import MarkdownEditor from '../../../components/MarkdownEditor';
import { TitleInput } from './TitleInput';
import { FormActions } from './FormActions';
import { CharacterCounter } from './CharacterCounter';

export const NewPostForm = ({ onSubmit, isSubmitting, error, limits }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const MIN_CONTENT_CHARS = limits?.CONTENT_MIN || 5;
  const MAX_CONTENT_CHARS = limits?.CONTENT_MAX || 25000;
  const MAX_TITLE_CHARS = limits?.TITLE_MAX || 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  const titleOverLimit = title.length > MAX_TITLE_CHARS;
  const contentOverLimit = content.length > MAX_CONTENT_CHARS;

  return (
    <div className="relative bg-white/40 dark:bg-gray-800/40 
              backdrop-blur-xl
              rounded-2xl p-4 sm:p-6
              border border-white/60 dark:border-gray-700/60
              shadow-2xl shadow-gray-900/10 dark:shadow-black/50
              overflow-hidden
              ring-1 ring-black/5 dark:ring-white/5">

      {/* Decorative gradient accent */}
      <div className="absolute top-0 right-0 w-32 h-32 
                    bg-gradient-to-br from-blue-500/5 to-purple-500/5
                    dark:from-blue-500/10 dark:to-purple-500/10
                    rounded-full blur-3xl -z-0" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl
                        bg-gradient-to-br from-red-50 to-red-100/50
                        dark:from-red-900/20 dark:to-red-900/10
                        border-2 border-red-200 dark:border-red-800/50
                        shadow-sm shadow-red-500/10 dark:shadow-black/20"
            role="alert">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <TitleInput
          value={title}
          onChange={setTitle}
          disabled={isSubmitting}
          maxChars={MAX_TITLE_CHARS}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-900 dark:text-gray-300"
            >
              Content
            </label>
            <a
              href="https://stacknova.ca/post/formatting-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold
                       text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-600 to-purple-600
                       dark:from-blue-400 dark:to-purple-400
                       hover:from-blue-700 hover:to-purple-700
                       dark:hover:from-blue-300 dark:hover:to-purple-300
                       flex items-center gap-1 group
                       transition-all duration-200"
            >
              Need help with formatting?
              <ExternalLink
                size={14}
                className="inline-block transform transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
          <MarkdownEditor
            content={content}
            onChange={setContent}
            disabled={isSubmitting}
          />
          <div className="mt-3 flex justify-between items-center">
            <CharacterCounter
              current={content.length}
              min={MIN_CONTENT_CHARS}
              max={MAX_CONTENT_CHARS}
            />
            <FormActions
              isSubmitting={isSubmitting}
              isDisabled={titleOverLimit || contentOverLimit}
            />
          </div>
        </div>
      </form>
    </div>
  );
};