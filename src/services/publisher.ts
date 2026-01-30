/**
 * Publisher Service
 * 
 * This service handles publishing workflow operations.
 */

import axios from 'axios';
import CONFIG from '@demo/config';

const PUBLISH_API_URL = `${CONFIG.PUBLISH_API_URL}/publisher`;

// ============================================
// INTERFACES
// ============================================

export interface PublishContentPayload {
    content_id: string;
    content_version_id: string;
    published_by: string;
}

// ============================================
// PUBLISHER API
// ============================================

/**
 * Publish content
 */
export const publishContent = async (payload: PublishContentPayload): Promise<any> => {
    try {
        const response = await axios.post(`${PUBLISH_API_URL}/publish`, payload);
        return {
            success: true,
            data: response.data,
            message: 'Content published successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to publish content'
        };
    }
};

export default {
    publishContent
};
