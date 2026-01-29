import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Input, Button, Typography, Card, Space, Tag } from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    PlusOutlined,
    PhoneOutlined,
    MailOutlined
} from '@ant-design/icons';
import { useRedirect } from '../../hooks/useRedirect';
import useUserStatus from '../../hooks/useUserStatus';
import Forbidden403 from '../errors/Forbidden403';
import { useTranslation } from 'react-i18next';
import useFetchOwners from '../../hooks/useFetchOwners';
import Asset from '../../components/Asset';

const { Title } = Typography;
const { Search } = Input;

const AdminOwners = () => {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    const { t } = useTranslation();
    const history = useHistory();

    const { owners, hasLoaded } = useFetchOwners();
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    // Filter owners based on search
    const filteredOwners = useMemo(() => {
        if (!owners) return [];

        const searchLower = searchText.toLowerCase();
        return owners.filter(owner => {
            return (
                owner.first_name?.toLowerCase().includes(searchLower) ||
                owner.last_name?.toLowerCase().includes(searchLower) ||
                owner.email?.toLowerCase().includes(searchLower) ||
                owner.phone?.toLowerCase().includes(searchLower) ||
                owner.phone_2?.toLowerCase().includes(searchLower) ||
                owner.notes?.toLowerCase().includes(searchLower)
            );
        });
    }, [owners, searchText]);

    const columns = [
        {
            title: t('Name'),
            key: 'name',
            width: 200,
            sorter: (a, b) => {
                const nameA = `${a.first_name} ${a.last_name}`;
                const nameB = `${b.first_name} ${b.last_name}`;
                return nameA.localeCompare(nameB);
            },
            render: (_, record) => (
                <div>
                    <strong style={{ fontSize: '15px' }}>
                        {record.first_name} {record.last_name}
                    </strong>
                </div>
            ),
        },
        {
            title: t('Contact'),
            key: 'contact',
            width: 280,
            render: (_, record) => (
                <Space orientation="vertical" size="small">
                    {record.email && (
                        <div>
                            <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                            <a href={`mailto:${record.email}`}>{record.email}</a>
                        </div>
                    )}
                    {record.phone && (
                        <div>
                            <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                            <a href={`tel:${record.phone}`}>{record.phone}</a>
                        </div>
                    )}
                </Space>
            ),
        },
        {
            title: t('Secondary Phone'),
            dataIndex: 'phone_2',
            key: 'phone_2',
            width: 150,
            render: (phone) => phone ? (
                <div>
                    <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                    <a href={`tel:${phone}`}>{phone}</a>
                </div>
            ) : (
                <Tag color="default">{t('N/A')}</Tag>
            ),
        },
        {
            title: t('Notes'),
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
            render: (notes) => notes || <Tag color="default">{t('No notes')}</Tag>,
        },
        {
            title: t('Actions'),
            key: 'actions',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => history.push(`/frontend/admin/listings/owners/${record.id}`)}
                    size="small"
                    style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                >
                    {t('View')}
                </Button>
            ),
        },
    ];

    if (userStatus === false) {
        return <Forbidden403 />;
    }

    if (!hasLoaded) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <Asset spinner />
            </div>
        );
    }

    return (
        <div style={{ padding: '94px 24px 24px 24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <Title level={2} style={{ margin: 0, color: '#1f1f1f' }}>
                    {t('Owners Management')}
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => history.push('/frontend/admin/listings/owners/create')}
                    style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                >
                    {t('Add New Owner')}
                </Button>
            </div>

            {/* Stats Card */}
            <Card style={{ marginBottom: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                        {owners?.length || 0}
                    </div>
                    <div style={{ color: '#8c8c8c' }}>{t('Total Owners')}</div>
                </div>
            </Card>

            {/* Search and Table Card */}
            <Card>
                <Space orientation="vertical" style={{ width: '100%', marginBottom: '16px' }}>
                    <Search
                        placeholder={t('Search by name, email, phone, or notes...')}
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: '600px' }}
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredOwners}
                    rowKey="id"
                    scroll={{ x: 900 }}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} ${t('of')} ${total} ${t('owners')}`,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                        current: currentPage,
                        pageSize: pageSize,
                    }}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                    }
                />
            </Card>
        </div>
    );
};

export default AdminOwners;
