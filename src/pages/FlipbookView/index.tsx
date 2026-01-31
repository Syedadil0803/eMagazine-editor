import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Message, Spin } from '@arco-design/web-react';
import { getEMagsByContentVersion } from '@demo/services/editor';
import { generateFlipBookHtml } from '@demo/components/FlipBookExport';

const FlipbookViewPage: React.FC = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [title, setTitle] = useState<string>('Magazine');

    const params = new URLSearchParams(location.search);
    const contentVersionId = params.get('content_version_id');
    const subject = params.get('subject');

    useEffect(() => {
        const loadFlipbook = async () => {
            if (!contentVersionId) {
                Message.error('No content version specified');
                return;
            }

            try {
                setLoading(true);
                const emags = await getEMagsByContentVersion(contentVersionId);

                if (emags && emags.length > 0) {
                    const eMag = emags[0];
                    const savedData = JSON.parse(eMag.htmlData);

                    if (savedData.pages && savedData.pages.length > 0) {
                        // Generate flipbook HTML using the same function as editor
                        const flipbookHtml = generateFlipBookHtml({
                            pages: savedData.pages,
                            currentPageIndex: 0,
                            templateSubject: subject || 'Magazine'
                        });

                        setHtmlContent(flipbookHtml);
                        setTitle(subject || 'Magazine');
                    } else {
                        Message.error('No pages found in magazine');
                    }
                } else {
                    Message.warning('No magazine data found. Please edit and save the content first.');
                }
            } catch (error) {
                console.error('Error loading flipbook:', error);
                Message.error('Failed to load flipbook');
            } finally {
                setLoading(false);
            }
        };

        loadFlipbook();
    }, [contentVersionId, subject]);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5'
            }}>
                <Spin size={40} />
                <div style={{ marginLeft: '16px' }}>
                    <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>
                        Loading flipbook...
                    </div>
                </div>
            </div>
        );
    }

    if (!htmlContent) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                background: '#f5f5f5'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>No content to display</h3>
                    <p style={{ margin: '0 0 24px 0', color: '#666' }}>
                        This magazine doesn't have any content yet.
                    </p>
                </div>
                <Button type="primary" onClick={() => window.close()}>
                    Close Window
                </Button>
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {/* Flipbook iframe - full screen when opened in new tab */}
            <iframe
                title={`${title} - Flipbook View`}
                srcDoc={htmlContent}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: '#fff'
                }}
            />
        </div>
    );
};

export default FlipbookViewPage;
