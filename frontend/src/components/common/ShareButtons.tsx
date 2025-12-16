'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({ url, title, description, className = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Ensure full URL
  const shareUrl = url.startsWith('http')
    ? url
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`;
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      'facebook-share',
      'width=600,height=400'
    );
  };

  const handleTwitterShare = () => {
    const text = description ? `${title} - ${description}` : title;
    const encodedText = encodeURIComponent(text);
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      'twitter-share',
      'width=600,height=400'
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      'linkedin-share',
      'width=600,height=400'
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleFacebookShare}
        className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <Facebook className="size-5" />
      </button>
      <button
        onClick={handleTwitterShare}
        className="rounded-lg bg-sky-500 p-2 text-white transition-colors hover:bg-sky-600"
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <Twitter className="size-5" />
      </button>
      <button
        onClick={handleLinkedInShare}
        className="rounded-lg bg-blue-700 p-2 text-white transition-colors hover:bg-blue-800"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin className="size-5" />
      </button>
      <button
        onClick={handleCopyLink}
        className={`rounded-lg border p-2 transition-colors ${
          copied
            ? 'border-green-500 bg-green-50 text-green-600'
            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
        }`}
        aria-label={copied ? 'Link copied!' : 'Copy link'}
        title={copied ? 'Link copied!' : 'Copy link'}
      >
        {copied ? <Check className="size-5" /> : <LinkIcon className="size-5" />}
      </button>
    </div>
  );
}

export default ShareButtons;
