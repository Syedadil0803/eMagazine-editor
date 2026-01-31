/**
 * Approval Service
 * 
 * This service handles approval workflow operations.
 */

import axios from 'axios';
import CONFIG from '@demo/config';

const APPROVAL_API_URL = `${CONFIG.APPROVAL_API_URL}/approval`;

// ============================================
// INTERFACES
// ============================================

export interface SubmitApprovalPayload {
    content_id: string;
    content_version_id: string;
    content_type: string;
    approval_levels: number;
}

// ============================================
// APPROVAL API
// ============================================

/**
 * Submit content for approval
 */
export const submitForApproval = async (payload: SubmitApprovalPayload): Promise<any> => {
    try {
        const response = await axios.post(`${APPROVAL_API_URL}/submit`, payload);
        return {
            success: true,
            data: response.data,
            message: 'Submitted for approval successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to submit for approval'
        };
    }
};

export interface ProcessApprovalPayload {
    approver_user_id: string;
    action: 'approved' | 'rejected';
    comments: string | string[];
}

/**
 * Process approval (Approve/Reject)
 */
export const processApproval = async (id: string, payload: ProcessApprovalPayload): Promise<any> => {
    try {
        const response = await axios.post(`${APPROVAL_API_URL}/process/${id}`, payload);
        return {
            success: true,
            data: response.data,
            message: 'Processed successfully'
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to process approval'
        };
    }
};

export default {
    submitForApproval,
    processApproval
};
