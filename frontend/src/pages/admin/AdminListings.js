import React, { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Input, Space, Button, Tag, Typography, Card, Row, Col } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import useFetchAllListings from '../../hooks/useFetchAllListings';
import useFetchLocationData from '../../hooks/useFetchLocationData';
import { useRedirect } from '../../hooks/useRedirect';
import useUserStatus from '../../hooks/useUserStatus';
import Forbidden403 from '../errors/Forbidden403';
import { useTranslation } from "react-i18next";
import Asset from '../../components/Asset';

const { Title } = Typography;
const { Search } = Input;

export default function AdminListingsAntD() {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    const { t, i18n } = useTranslation();
    const lng = i18n.language;

    const { regionsData } = useFetchLocationData();
    const { listings, hasLoaded } = useFetchAllListings();
    const [searchText, setSearchText] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const history = useHistory();

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
        if (!listings?.results) return { total: 0, approved: 0, featured: 0, pending: 0, sold: 0 };

        return {
            total: listings.results.length,
            approved: listings.results.filter(l => l.approved).length,
            featured: listings.results.filter(l => l.featured).length,
            pending: listings.results.filter(l => !l.approved).length,
            sold: listings.results.filter(l =>
                l.amenities?.some(amenity => amenity.name === 'sold' || amenity.id === 208)
            ).length,
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
            title: t('Agent Name'),
            dataIndex: 'agent_name',
            key: 'agent_name',
            sorter: (a, b) => (a.agent_name || '').localeCompare(b.agent_name || ''),
            sortOrder: sortedInfo.columnKey === 'agent_name' ? sortedInfo.order : null,
        },
        {
            title: t('Type'),
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: t('propertyDetails.types.residential'), value: 'residential' },
                { text: t('propertyDetails.types.commercial'), value: 'commercial' },
                { text: t('propertyDetails.types.land'), value: 'land' },
            ],
            filteredValue: filteredInfo.type || null,
            onFilter: (value, record) => record.type === value,
            render: (type) => {
                const colors = {
                    residential: 'blue',
                    commercial: 'green',
                    land: 'orange',
                };
                return <Tag color={colors[type]}>{t(`propertyDetails.types.${type}`)}</Tag>;
            },
        },
        {
            title: t('Sub Type'),
            dataIndex: 'sub_type',
            key: 'sub_type',
            sorter: (a, b) => (a.sub_type || '').localeCompare(b.sub_type || ''),
            sortOrder: sortedInfo.columnKey === 'sub_type' ? sortedInfo.order : null,
            render: (subType) => subType ? t(`propertyDetails.subTypes.${subType}`) : '-',
        },
        {
            title: t('Municipality'),
            dataIndex: 'municipality_id',
            key: 'municipality_id',
            sorter: (a, b) => {
                const nameA = getMunicipalityName(a.municipality_id, a.county_id, a.region_id);
                const nameB = getMunicipalityName(b.municipality_id, b.county_id, b.region_id);
                return nameA.localeCompare(nameB);
            },
            sortOrder: sortedInfo.columnKey === 'municipality_id' ? sortedInfo.order : null,
            render: (municipalityId, record) => {
                const name = getMunicipalityName(municipalityId, record.county_id, record.region_id);
                return name === t('N/A')
                    ? <Tag color="red">{t('Update Required')}</Tag>
                    : name;
            },
        },
        {
            title: t('Sale Type'),
            dataIndex: 'sale_type',
            key: 'sale_type',
            filters: [
                { text: t('propertyDetails.typeRent'), value: 'rent' },
                { text: t('propertyDetails.typeSale'), value: 'sale' },
            ],
            filteredValue: filteredInfo.sale_type || null,
            onFilter: (value, record) => record.sale_type === value,
            render: (saleType) => {
                const color = saleType === 'rent' ? 'purple' : 'cyan';
                return <Tag color={color}>{t(`propertyDetails.type${saleType === 'rent' ? 'Rent' : 'Sale'}`)}</Tag>;
            },
        },
        {
            title: t('Floor Area'),
            dataIndex: 'floor_area',
            key: 'floor_area',
            sorter: (a, b) => (a.floor_area || 0) - (b.floor_area || 0),
            sortOrder: sortedInfo.columnKey === 'floor_area' ? sortedInfo.order : null,
            render: (area) => area ? `${area} m²` : '-',
        },
        {
            title: t('Land Area'),
            dataIndex: 'land_area',
            key: 'land_area',
            sorter: (a, b) => (a.land_area || 0) - (b.land_area || 0),
            sortOrder: sortedInfo.columnKey === 'land_area' ? sortedInfo.order : null,
            render: (area) => area ? `${area} m²` : '-',
        },
        {
            title: t('Price'),
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : null,
            render: (price, record) => price
                ? `${record.currency || '€'}${price.toLocaleString()}`
                : '-',
        },
        {
            title: t('Status'),
            key: 'status',
            width: 120,
            filters: [
                { text: t('Approved'), value: 'approved' },
                { text: t('Featured'), value: 'featured' },
                { text: t('Pending'), value: 'pending' },
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
                        <Tag color="default">{t('Pending')}</Tag>
                    )}
                </Space>
            ),
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
                    onClick={() => history.push(`/listings/${record.id}`)}
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
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Title level={2} style={{ marginBottom: '24px', color: '#1f1f1f' }}>
                {t('Listings Management')}
            </Title>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6} lg={5}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                                {stats.total}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>{t('Total Listings')}</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={5}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                                {stats.approved}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>{t('Approved')}</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={5}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>
                                {stats.featured}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>{t('Featured')}</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={5}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                {stats.pending}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>{t('Pending')}</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>
                                {stats.sold}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>{t('Sold')}</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Search and Table Card */}
            <Card>
                <Space orientation="vertical" style={{ width: '100%', marginBottom: '16px' }}>
                    <Search
                        placeholder={t('Search by ID, Agent, Type, Municipality, Price...')}
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
                        pageSize: 20,
                        showSizeChanger: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} ${t('of')} ${total} ${t('listings')}`,
                    }}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                    }
                />
            </Card>
        </div>
    );
}