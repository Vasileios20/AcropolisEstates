import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Upload,
    Select,
    Input,
    Space,
    Tag,
    Popconfirm,
    message as antMessage,
    Empty,
    Divider,
    Typography
} from 'antd';
import {
    UploadOutlined,
    DownloadOutlined,
    DeleteOutlined,
    FileOutlined,
} from '@ant-design/icons';
import { axiosReq } from '../api/axiosDefaults';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;


const ListingFilesSection = ({ listingId, isShortTerm = false }) => {
    const { t } = useTranslation();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Upload form state
    const [fileToUpload, setFileToUpload] = useState(null);
    const [selectedFileType, setSelectedFileType] = useState('note');
    const [fileDescription, setFileDescription] = useState('');

    const apiBase = isShortTerm ? 'short-term-listings' : 'listings';

    const FILE_TYPES = [
        { value: 'offer', label: t('admin.fileSelection.offer'), color: '#52c41a' },
        { value: 'contract', label: t('admin.fileSelection.contract'), color: '#1890ff' },
        { value: 'inspection', label: t('admin.fileSelection.inspection'), color: '#faad14' },
        { value: 'appraisal', label: t('admin.fileSelection.appraisal'), color: '#722ed1' },
        { value: 'title_deed', label: t('admin.fileSelection.title_deed'), color: '#eb2f96' },
        { value: 'energy_certificate', label: t('admin.fileSelection.energy_certificate'), color: '#13c2c2' },
        { value: 'floor_plan', label: t('admin.fileSelection.floor_plan'), color: '#52c41a' },
        { value: 'survey', label: t('admin.fileSelection.survey'), color: '#2f54eb' },
        { value: 'permit', label: t('admin.fileSelection.permit'), color: '#fa8c16' },
        { value: 'tax_document', label: t('admin.fileSelection.tax_document'), color: '#f5222d' },
        { value: 'utility_bill', label: t('admin.fileSelection.utility_bill'), color: '#fadb14' },
        { value: 'insurance', label: t('admin.fileSelection.insurance'), color: '#a0d911' },
        { value: 'correspondence', label: t('admin.fileSelection.correspondence'), color: '#bfbfbf' },
        { value: 'note', label: t('admin.fileSelection.note'), color: '#8c8c8c' },
        { value: 'photo_additional', label: t('admin.fileSelection.photo_additional'), color: '#597ef7' },
        { value: 'legal', label: t('admin.fileSelection.legal'), color: '#ff4d4f' },
        { value: 'financial', label: t('admin.fileSelection.financial'), color: '#73d13d' },
        { value: 'municipal_approval', label: t('admin.fileSelection.municipal_approval'), color: '#40a9ff' },
        { value: 'zoning', label: t('admin.fileSelection.zoning'), color: '#9254de' },
        { value: 'environmental', label: t('admin.fileSelection.environmental'), color: '#36cfc9' },
        { value: 'structural', label: t('admin.fileSelection.structural'), color: '#ffa940' },
        { value: 'mortgage', label: t('admin.fileSelection.mortgage'), color: '#ff7a45' },
        { value: 'lease', label: t('admin.fileSelection.lease'), color: '#5cdbd3' },
        { value: 'other', label: t('admin.fileSelection.other'), color: '#d9d9d9' },
    ];

    useEffect(() => {
        if (listingId) {
            fetchFiles();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listingId]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const { data } = await axiosReq.get(`/${apiBase}/${listingId}/files/`);
            setFiles(data.files || []);
        } catch (err) {
            console.error('Error fetching files:', err);
            antMessage.error(t('admin.fileSelection.failedToLoadFiles'));
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!fileToUpload) {
            antMessage.warning(t('admin.fileSelection.pleaseSelectAFile'));
            return;
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('file_type', selectedFileType);
        formData.append('description', fileDescription);
        formData.append('listing', listingId);

        try {
            setUploading(true);
            await axiosReq.post(`/${apiBase}/${listingId}/files/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            antMessage.success(t('admin.fileSelection.fileUploadedSuccessfully'));
            setFileToUpload(null);
            setFileDescription('');
            setSelectedFileType('note');
            fetchFiles();
        } catch (err) {
            console.error('Error uploading file:', err);
            antMessage.error(err.response?.data?.file?.[0] || t('admin.fileSelection.failedToUploadFile'));
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await axiosReq.get(`/${apiBase}/${listingId}/files/${fileId}/download/`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'download');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading file:', err);
            antMessage.error(t('admin.fileSelection.failedToDownloadFile'));
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await axiosReq.delete(`/${apiBase}/${listingId}/files/${fileId}/`);
            antMessage.success(t('admin.fileSelection.fileDeletedSuccessfully'));
            fetchFiles();
        } catch (err) {
            // console.error('Error deleting file:', err);
            antMessage.error(t('admin.fileSelection.failedToDeleteFile'));
        }
    };

    const getFileTypeColor = (fileType) => {
        const type = FILE_TYPES.find(ft => ft.value === fileType);
        return type?.color || '#d9d9d9';
    };

    const getFileTypeLabel = (fileType) => {
        const type = FILE_TYPES.find(ft => ft.value === fileType);
        return type?.label || fileType;
    };

    const columns = [
        {
            title: t('admin.fileSelection.fileName'),
            dataIndex: 'file_name',
            key: 'file_name',
            render: (fileName) => (
                <Space>
                    <FileOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                    <Text strong>{fileName}</Text>
                </Space>
            ),
        },
        {
            title: t('admin.fileSelection.fileType'),
            dataIndex: 'file_type',
            key: 'file_type',
            render: (fileType) => (
                <Tag color={getFileTypeColor(fileType)}>
                    {getFileTypeLabel(fileType)}
                </Tag>
            ),
        },
        {
            title: t('admin.fileSelection.description'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (desc) => desc || <Text type="secondary">-</Text>,
        },
        {
            title: t('admin.fileSelection.uploadedBy'),
            dataIndex: 'uploaded_by_username',
            key: 'uploaded_by_username',
            render: (username) => username || <Text type="secondary">-</Text>,
        },
        {
            title: t('admin.fileSelection.dateUploaded'),
            dataIndex: 'uploaded_at',
            key: 'uploaded_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: t('admin.fileSelection.actions'),
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(record.id, record.file_name)}
                        size="small"
                    >
                        {t('admin.fileSelection.download')}
                    </Button>
                    <Popconfirm
                        title={t('admin.fileSelection.deleteFile')}
                        description={t('admin.fileSelection.deleteFileConfirmation')}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t('admin.fileSelection.yesDelete')}
                        cancelText={t('admin.fileSelection.noCancel')}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            {t('admin.fileSelection.delete')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ marginTop: '32px' }}>
            <Card title={
                <Title level={4} style={{ margin: 0 }}>
                    <FileOutlined style={{ marginRight: '8px' }} />
                    {t('admin.fileSelection.listingFilesAndDocuments')}
                </Title>
            }>
                {/* Upload Section */}
                <Card
                    type="inner"
                    title={t('admin.fileSelection.uploadNewFile')}
                    style={{ marginBottom: '24px', backgroundColor: '#fafafa' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Upload
                            beforeUpload={(file) => {
                                setFileToUpload(file);
                                return false;
                            }}
                            onRemove={() => setFileToUpload(null)}
                            maxCount={1}
                            fileList={fileToUpload ? [fileToUpload] : []}
                        >
                            <Button icon={<UploadOutlined />}>
                                {t('admin.fileSelection.selectFileMaxSize', { size: '10MB' })}
                            </Button>
                        </Upload>

                        <Select
                            placeholder={t('admin.fileSelection.selectFileType')}
                            value={selectedFileType}
                            onChange={setSelectedFileType}
                            style={{ width: '100%' }}
                            showSearch
                            optionFilterProp="children"
                        >
                            {FILE_TYPES.map(type => (
                                <Option key={type.value} value={type.value}>
                                    <Tag color={type.color}>{type?.label}</Tag>
                                </Option>
                            ))}
                        </Select>

                        <TextArea
                            placeholder={t('admin.fileSelection.addDescriptionOrNotes')}
                            value={fileDescription}
                            onChange={(e) => setFileDescription(e.target.value)}
                            rows={3}
                        />

                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={handleUpload}
                            loading={uploading}
                            disabled={!fileToUpload}
                            size="large"
                            block
                            style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                        >
                            {t('admin.fileSelection.uploadFile')}
                        </Button>
                    </Space>
                </Card>

                <Divider />

                {/* Files List */}
                <div>
                    <Title level={5}>{t('admin.fileSelection.uploadedFiles')} ({files.length})</Title>
                    {files.length === 0 ? (
                        <Empty
                            description={t('admin.fileSelection.noFilesUploadedYet')}
                            style={{ marginTop: '32px', marginBottom: '32px' }}
                        />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={files}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 800 }}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ListingFilesSection;