import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { axiosReq } from '../api/axiosDefaults';
import Brochure from './Brochure';
import { useTranslation } from 'react-i18next';

const BrochureModal = ({ listingId, visible, onClose, endpoint = 'listings' }) => {
    const [listingData, setListingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (visible && listingId) {
            fetchListingData();
        } else {
            // Reset data when modal closes
            setListingData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, listingId]);

    const fetchListingData = async () => {
        setLoading(true);
        try {
            const { data } = await axiosReq.get(`/${endpoint}/${listingId}/`);
            setListingData(data);
        } catch (err) {
            console.error('Error fetching listing:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get amenities list from listing data
    const amenitiesList = listingData?.amenities || [];

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width="95vw"
            style={{ top: 20, paddingTop: "20px" }}
            bodyStyle={{
                padding: 0,
                maxHeight: '90vh',
                overflow: 'auto',
                backgroundColor: '#f5f5f5'
            }}
            closeIcon={<CloseOutlined style={{ fontSize: '20px', color: '#fff' }} />}
            title={
                <div style={{
                    backgroundColor: '#847c3d',
                    color: '#fff',
                    padding: '14px 24px',
                    margin: '-20px -24px 0',
                    fontSize: '18px',
                    fontWeight: 600
                }}>
                    {t("brochure.title", { id: listingId })}
                </div>
            }
            destroyOnClose
        >
            {loading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    gap: '16px'
                }}>
                    <Spin size="large" />
                    <p style={{ color: '#666', fontSize: '16px' }}>
                        {t('brochure.loadingPdf')}
                    </p>
                </div>
            ) : listingData ? (
                <div style={{
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Brochure
                        {...listingData}
                        amenitiesList={amenitiesList}
                        showDownloadButton={true}
                    />
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 40px',
                    color: '#999',
                    fontSize: '16px'
                }}>
                    {t('brochure.error')}
                </div>
            )}
        </Modal>
    );
};

export default BrochureModal;