import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Message, Button } from '@arco-design/web-react';
import { getEMagsByContentVersion } from '@demo/services/editor';
import { generateFlipBookHtml } from '@demo/pages/Home/components/FlipBookExport';
import { Loading } from '@demo/components/loading';

const PreviewPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [htmlContent, setHtmlContent] = useState<string>('');

    const params = new URLSearchParams(location.search);
    const contentVersionId = params.get('content_version_id');
    const subject = params.get('subject');

    useEffect(() => {
        const loadPreview = async () => {
            if (!contentVersionId) {
                Message.error('No content version specified');
                navigate(-1);
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
                            currentValues: {
                                subject: subject || 'Magazine',
                                subTitle: '',
                                content: savedData.pages[0].content
                            },
                            templateSubject: subject || 'Magazine',
                            mergeTags: {}
                        });

                        setHtmlContent(flipbookHtml);
                    } else {
                        Message.error('No pages found in magazine');
                    }
                } else {
                    Message.warning('No magazine data found. Please edit and save the content first.');
                }
            } catch (error) {
                console.error('Error loading preview:', error);
                Message.error('Failed to load preview');
            } finally {
                setLoading(false);
            }
        };

        loadPreview();
    }, [contentVersionId, subject, navigate]);

    if (loading) {
        return (
            <Loading loading={loading}>
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f5f5f5'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="loader" style={{
                            fontSize: '48px',
                            color: '#1890ff',
                            marginBottom: '20px'
                        }}>
                            <i className="fas fa-spinner fa-spin"></i>
                        </div>
                        <p style={{ fontSize: '18px', color: '#666' }}>
                            Loading preview...
                        </p>
                    </div>
                </div>
            </Loading>
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
                <p>No content to display.</p>
                <Button type="primary" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <iframe
                title="Magazine Preview"
                srcDoc={htmlContent}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
            />
        </div>
    );
};

export default PreviewPage;
