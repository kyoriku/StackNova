import { useState } from 'react';
import MarkdownEditor from '../../../components/MarkdownEditor';
import { TitleInput } from './TitleInput';
import { FormActions } from './FormActions';

export const NewPostForm = ({ onSubmit, isSubmitting, error }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div 
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 
                   rounded-lg text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <TitleInput 
        value={title} 
        onChange={setTitle} 
        disabled={isSubmitting} 
      />

      <div>
        <label 
          htmlFor="content"
          className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
        >
          Content
        </label>
        <MarkdownEditor
          content={content}
          onChange={setContent}
          disabled={isSubmitting}
        />
      </div>

      <FormActions isSubmitting={isSubmitting} />
    </form>
  );
};