/**
 * Advisor Briefing Modal Component
 *
 * Displays the AI-generated strategic briefing in a professional format
 * with markdown rendering, copy/download functionality
 */

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download } from 'lucide-react';
import type { SkillProfile } from '@/lib/skill-profile-adapter';
import { logger } from '@/lib/logger';

interface AdvisorBriefingModalProps {
  briefing: string;
  profile: SkillProfile;
  onClose: () => void;
}

export const AdvisorBriefingModal: React.FC<AdvisorBriefingModalProps> = ({
  briefing,
  profile,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(briefing);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy briefing to clipboard');
    }
  };

  const handleDownload = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `advisor-briefing-${profile.userId.slice(0, 8)}-${timestamp}.md`;

      const blob = new Blob([briefing], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('Downloaded briefing', { operation: 'advisor-briefing.download', filename });
    } catch (error) {
      console.error('Failed to download:', error);
      alert('Failed to download briefing');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle className="text-lg sm:text-2xl">Advisor Briefing</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                AI-powered plan for {profile.userName}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-xs sm:text-sm min-h-[40px]"
              >
                <Copy className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-1.5 text-xs sm:text-sm min-h-[40px]"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node: _node, ...props }) => (
                  <h2 className="text-xl font-bold mt-6 mb-3 text-blue-600 dark:text-blue-400" {...props} />
                ),
                h3: ({ node: _node, ...props }) => (
                  <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                ),
                p: ({ node: _node, ...props }) => (
                  <p className="mb-3 leading-relaxed" {...props} />
                ),
                strong: ({ node: _node, ...props }) => (
                  <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
                ),
                ul: ({ node: _node, ...props }) => (
                  <ul className="list-disc pl-6 mb-3 space-y-1" {...props} />
                ),
                ol: ({ node: _node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />
                ),
                li: ({ node: _node, ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
                blockquote: ({ node: _node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300" {...props} />
                ),
                code: ({ node: _node, inline, ...props }: React.ComponentPropsWithoutRef<'code'> & { node?: unknown; inline?: boolean }) =>
                  inline ? (
                    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm" {...props} />
                  ) : (
                    <code className="block bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm overflow-x-auto" {...props} />
                  ),
              }}
            >
              {briefing}
            </ReactMarkdown>
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Generated by Claude • {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
          <Button variant="outline" onClick={onClose} className="min-h-[40px] w-full sm:w-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
