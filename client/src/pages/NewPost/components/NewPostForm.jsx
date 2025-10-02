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
  const MAX_CONTENT_CHARS = limits?.CONTENT_MAX || 25001;
  const MAX_TITLE_CHARS = limits?.TITLE_MAX || 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  const titleOverLimit = title.length > MAX_TITLE_CHARS;
  const contentOverLimit = content.length > MAX_CONTENT_CHARS;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 
          dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm"
          role="alert"
        >
          {error}
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
            className="block text-sm font-medium text-gray-900 dark:text-white"
          >
            Content
          </label>
          <a
            href="https://stacknova.ca/post/formatting-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 flex items-center gap-1 group"
          >
            Need help with formatting? View our guide
            <ExternalLink
              size={16}
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
        <div className="mt-2 flex justify-between items-center">
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
  );
};