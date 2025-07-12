import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Smile,
  Code,
  Quote,
  Undo,
  Redo,
  Eye,
  Edit3,
  Type,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

// Local Button Component
const Button = ({ children, onClick, disabled, variant = 'default', size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs rounded',
    md: 'px-3 py-2 text-sm rounded-md',
    lg: 'px-4 py-3 text-base rounded-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Local Textarea Component
const Textarea = ({ className = '', ...props }) => {
  const baseClasses = 'block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none';
  
  return (
    <textarea
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};

// Markdown to HTML converter for preview
const markdownToHtml = (markdown) => {
  return markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
    .replace(/\n/g, '<br />');
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Start typing...", height = "300px" }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // Auto-save to history
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== history[historyIndex]) {
        addToHistory(value);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [value]);

  const addToHistory = (newValue: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const getSelectionInfo = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, selectedText: '' };
    
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      selectedText: value.substring(textarea.selectionStart, textarea.selectionEnd)
    };
  };

  const insertText = (beforeText: string, afterText: string = '', replaceSelection: boolean = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end, selectedText } = getSelectionInfo();
    
    let newText;
    let newCursorPos;
    
    if (replaceSelection) {
      newText = `${beforeText}${selectedText}${afterText}`;
      newCursorPos = start + beforeText.length + (selectedText ? selectedText.length : 0);
    } else {
      newText = beforeText;
      newCursorPos = start + beforeText.length;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    addToHistory(newValue);

    // Restore cursor position
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const formatText = (format: string) => {
    const { selectedText } = getSelectionInfo();

    switch (format) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'strikethrough':
        insertText('~~', '~~');
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          insertText('```\n', '\n```');
        } else {
          insertText('`', '`');
        }
        break;
      case 'quote':
        insertText('> ', '');
        break;
      case 'h1':
        insertText('# ', '');
        break;
      case 'h2':
        insertText('## ', '');
        break;
      case 'h3':
        insertText('### ', '');
        break;
      case 'bullet':
        insertText('- ', '');
        break;
      case 'numbered':
        insertText('1. ', '');
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          insertText(`[${selectedText || 'Link text'}](${url})`, '', false);
        }
        break;
      case 'hr':
        insertText('\n---\n', '', false);
        break;
    }
  };

  const insertEmoji = () => {
    const emojis = ['😀', '😍', '🤔', '👍', '🚀', '💡', '🔥', '✨', '🎉', '💯', '🤝', '❤️', '🎯', '⚡', '🌟', '🏆'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    insertText(randomEmoji, '', false);
  };

  const insertImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      const altText = prompt('Enter alt text (optional):') || 'Image';
      insertText(`![${altText}](${imageUrl})`, '', false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'k':
          e.preventDefault();
          formatText('link');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'Enter':
          if (e.shiftKey) {
            e.preventDefault();
            insertText('\n', '', false);
          }
          break;
      }
    }
  };

  const handleSelectionChange = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      setSelectionStart(textarea.selectionStart);
      setSelectionEnd(textarea.selectionEnd);
    }
  };

  const getWordCount = () => {
    return value.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharCount = () => {
    return value.length;
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Enhanced Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 bg-gray-50 border-b border-gray-200">
        {/* Mode Toggle */}
        <div className="flex items-center mr-2">
          <Button
            variant={!previewMode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode(false)}
            className="rounded-r-none"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant={previewMode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode(true)}
            className="rounded-l-none"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* History */}
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={historyIndex <= 0}
          className="h-8 w-8 p-0"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="h-8 w-8 p-0"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <Button variant="ghost" size="sm" onClick={() => formatText('h1')} className="h-8 w-8 p-0" title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('h2')} className="h-8 w-8 p-0" title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('h3')} className="h-8 w-8 p-0" title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <Button variant="ghost" size="sm" onClick={() => formatText('bold')} className="h-8 w-8 p-0" title="Bold (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('italic')} className="h-8 w-8 p-0" title="Italic (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('strikethrough')}
          className="h-8 w-8 p-0"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('code')} className="h-8 w-8 p-0" title="Code">
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists and Quotes */}
        <Button variant="ghost" size="sm" onClick={() => formatText('bullet')} className="h-8 w-8 p-0" title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('numbered')} className="h-8 w-8 p-0" title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => formatText('quote')} className="h-8 w-8 p-0" title="Quote">
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Media and Links */}
        <Button variant="ghost" size="sm" onClick={() => formatText('link')} className="h-8 w-8 p-0" title="Link (Ctrl+K)">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertImage} className="h-8 w-8 p-0" title="Image">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={insertEmoji} className="h-8 w-8 p-0" title="Emoji">
          <Smile className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Horizontal Rule */}
        <Button variant="ghost" size="sm" onClick={() => formatText('hr')} className="h-8 w-8 p-0" title="Horizontal Rule">
          <Type className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {previewMode ? (
          <div 
            className="p-4 min-h-[200px] prose prose-sm max-w-none"
            style={{ minHeight: height }}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(value) || '<p className="text-gray-500">Nothing to preview...</p>' }}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelectionChange}
            placeholder={placeholder}
            className="border-0 focus:ring-0 rounded-none font-mono text-sm leading-relaxed resize-none"
            style={{ minHeight: height }}
          />
        )}
      </div>

      {/* Enhanced Footer */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span>📝 Markdown supported</span>
          <span>•</span>
          <span>⌨️ Ctrl+B bold, Ctrl+I italic, Ctrl+K link</span>
          <span>•</span>
          <span>↩️ Shift+Enter for line break</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>{getWordCount()} words</span>
          <span>•</span>
          <span>{getCharCount()} characters</span>
        </div>
      </div>
    </div>
  );
}

// Example usage component
const RichTextEditorExample = () => {
  const [content, setContent] = useState(`# Welcome to the Rich Text Editor

This is a **powerful** and *flexible* markdown editor with:

- Live preview mode
- Comprehensive formatting options
- Keyboard shortcuts
- Auto-save functionality
- Word and character count

## Features

1. **Bold** and *italic* text
2. \`Code blocks\` and inline code
3. Links and images
4. Lists and quotes
5. Undo/Redo functionality

> This is a quote block

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

Try switching to preview mode to see the rendered output!`);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Rich Text Editor Demo</h1>
      <RichTextEditor
        value={content}
        onChange={setContent}
        placeholder="Start writing your content here..."
        height="400px"
      />
    </div>
  );
};

export default RichTextEditorExample;