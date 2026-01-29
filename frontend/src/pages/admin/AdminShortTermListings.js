import React, { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Input, Space, Button, Tag, Typography, Card, Row, Col, Statistic } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import useFetchLocationData from '../../hooks/useFetchLocationData';
import { useRedirect } from '../../hooks/useRedirect';
import useUserStatus from '../../hooks/useUserStatus';
import Forbidden403 from '../errors/Forbidden403';
import { useTranslation } from "react-i18next";
import Asset from '../../components/Asset';
import useFetchShortTermListings from 'hooks/useFetchShortTermListings';
import {
    UserOutlined,
    PlusOutlined,
    HomeOutlined,
    ClockCircleOutlined,
    StarFilled,
} from '@ant-design/icons';

const { Title } = Typography;
const { Search } = Input;

export default function AdminShortTermListings() {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    const { t, i18n } = useTranslation();
    const lng = i18n.language;

    const { regionsData } = useFetchLocationData();
    const { listings, hasLoaded } = useFetchShortTermListings();
    const [searchText, setSearchText] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    // Build municipality lookup
    const allMunicipalities = useMemo(() => {
        return regionsData?.flatMap(region =>
            region.counties?.flatMap(county =>
                county.municipalities?.map(municipality => ({
                    id: municipality.id,
                    greekName: municipality.greekName,
                    englishName: municipality.englishName,
                    countyId: county.id,
                    regionId: region.id,
                }))
            )
        ) || [];
    }, [regionsData]);

    const getMunicipalityName = useCallback((municipalityId, countyId, regionId) => {
            const municipality = allMunicipalities.find(m =>
                m.id === municipalityId &&
                m.countyId === countyId &&
                m.regionId === regionId
            );
            return municipality
                ? (lng === "el" ? municipality.greekName : municipality.englishName)
                : t('N/A');
        }, [allMunicipalities, lng, t]);
    
        // Filter listings based on search
        const filteredListings = useMemo(() => {
            if (!listings?.results) return [];
    
            const searchLower = searchText.toLowerCase();
            return listings.results.filter(listing => {
                const municipalityName = getMunicipalityName(
                    listing.municipality_id,
                    listing.county_id,
                    listing.region_id
                ).toLowerCase();
    
                return (
                    listing.agent_name?.toLowerCase().includes(searchLower) ||
                    listing.id.toString().includes(searchLower) ||
                    listing.type?.toLowerCase().includes(searchLower) ||
                    listing.sub_type?.toLowerCase().includes(searchLower) ||
                    municipalityName.includes(searchLower) ||
                    listing.sale_type?.toLowerCase().includes(searchLower) ||
                    listing.price?.toString().includes(searchLower)
                );
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [listings, searchText, allMunicipalities, lng, getMunicipalityName]);

    // Stats cards data
    const stats = useMemo(() => {
        if (!listings?.results) return { total: 0, approved: 0, featured: 0, pending: 0 };

        return {
            total: listings.results.length,
            approved: listings.results.filter(l => l.approved).length,
            featured: listings.results.filter(l => l.featured).length,
            pending: listings.results.filter(l => !l.approved).length,
        };
    }, [listings]);

    const handleTableChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns = [
        {
            title: t('ID'),
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => a.id - b.id,
            sortOrder: sortedInfo.columnKey === 'id' ? sortedInfo.order : null,
            render: (id) => <strong>#{id}</strong>,
        },
        {
            title: t('propertyDetails.agentName'),
            dataIndex: 'agent_name',
            key: 'agent_name',
            width: 150,
            sorter: (a, b) => (a.agent_name || '').localeCompare(b.agent_name || ''),
            sortOrder: sortedInfo.columnKey === 'agent_name' ? sortedInfo.order : null,
        },
        {
            title: lng === 'el' ? t('propertyDetails.municipality_gr') : t('propertyDetails.municipality'),
            dataIndex: 'municipality_id',
            key: 'municipality_id',
            width: 200,
            sorter: (a, b) => {
                const nameA = getMunicipalityName(a.municipality_id, a.county_id, a.region_id);
                const nameB = getMunicipalityName(b.municipality_id, b.county_id, b.region_id);
                return nameA.localeCompare(nameB);
            },
            sortOrder: sortedInfo.columnKey === 'municipality_id' ? sortedInfo.order : null,
            render: (municipalityId, record) => {
                const name = getMunicipalityName(municipalityId, record.county_id, record.region_id);
                return name === t('N/A')
                    ? <Tag color="red">{t('propertyDetails.updateRequired')}</Tag>
                    : name;
            },
        },
        {
            title: t('propertyDetails.maxGuests'),
            dataIndex: 'max_guests',
            key: 'max_guests',
            width: 200,
            sorter: (a, b) => (a.max_guests || 0) - (b.max_guests || 0),
            render: (guests) => (
                <Space>
                    <UserOutlined />
                    {guests || '-'}
                </Space>
            ),
        },
        {
            title: t('propertyDetails.price'),
            dataIndex: 'price',
            key: 'price',
            width: 100,
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : null,
            render: (price, record) => price
                ? `${record.currency || '€'}${price.toLocaleString()}`
                : '-',
        },
        {
            title: t('propertyDetails.status.title'),
            key: 'status',
            width: 200,
            filters: [
                { text: t('propertyDetails.approved'), value: 'approved' },
                { text: t('propertyDetails.featured'), value: 'featured' },
                { text: t('propertyDetails.pending'), value: 'pending' },
            ],
            filteredValue: filteredInfo.status || null,
            onFilter: (value, record) => {
                if (value === 'approved') return record.approved;
                if (value === 'featured') return record.featured;
                if (value === 'pending') return !record.approved;
                return false;
            },
            render: (_, record) => (
                <Space>
                    {record.approved && (
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                    )}
                    {record.featured && (
                        <StarOutlined style={{ color: '#faad14', fontSize: '18px' }} />
                    )}
                    {!record.approved && !record.featured && (
                        <Tag color="default">{t('propertyDetails.status.pending')}</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: t('propertyDetails.actions.title'),
            key: 'actions',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => history.push(`/short-term-listings/${record.id}`)}
                    size="small"
                    style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                >
                    {t('propertyDetails.actions.viewListing')}
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
            <Title level={2} style={{ marginBottom: '24px', color: '#1f1f1f' }}>
                {t('admin.listings.titleRentals')}
            </Title>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => history.push('/frontend/admin/short-term-listings/create')}
                style={{ backgroundColor: '#847c3d', borderColor: '#847c3d', marginBottom: '24px' }}
            >
                {t('admin.listings.addListing')}
            </Button>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.totalListings')}
                            value={stats.total}
                            prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
                            styles={{ color: '#1890ff', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.approved')}
                            value={stats.approved}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            styles={{ color: '#52c41a', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.featured')}
                            value={stats.featured}
                            prefix={<StarFilled style={{ color: '#faad14' }} />}
                            styles={{ color: '#faad14', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.pending')}
                            value={stats.pending}
                            prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
                            styles={{ color: '#ff4d4f', fontSize: '32px', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>
            {/* Search and Table Card */}
            <Card>
                <Space orientation="vertical" style={{ width: '100%', marginBottom: '16px' }}>
                    <Search
                        placeholder={t('admin.listings.searchPlaceholder')}
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
                    dataSource={filteredListings}
                    rowKey="id"
                    onChange={handleTableChange}
                    scroll={{ x: 1500 }}
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} ${t('of')} ${total} ${t('admin.listings.rentals')}`,
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
}
