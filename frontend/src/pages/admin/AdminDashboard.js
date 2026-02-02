import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Statistic, Button, Space } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    MessageOutlined,
    PlusCircleOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    StarOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { useRedirect } from '../../hooks/useRedirect';
import useUserStatus from '../../hooks/useUserStatus';
import Forbidden403 from '../errors/Forbidden403';
import { useTranslation } from 'react-i18next';
import useFetchAllListings from '../../hooks/useFetchAllListings';
import useFetchShortTermListings from '../../hooks/useFetchShortTermListings';
import useFetchOwners from '../../hooks/useFetchOwners';
import { axiosReq } from '../../api/axiosDefaults';
import Asset from '../../components/Asset';

const { Title, Text } = Typography;

const AdminDashboard = () => {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    const { t } = useTranslation();

    const { listings, hasLoaded: listingsLoaded } = useFetchAllListings();
    const { listings: shortTermListingsData, hasLoaded: shortTermLoaded } = useFetchShortTermListings();
    const { owners, hasLoaded: ownersLoaded } = useFetchOwners();

    const [bookings, setBookings] = useState([]);
    const [bookingsLoaded, setBookingsLoaded] = useState(false);

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axiosReq.get('/short-term-bookings/');
                // Extract results from paginated response
                const bookingsArray = data.results || [];
                setBookings(bookingsArray);
                setBookingsLoaded(true);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setBookings([]);
                setBookingsLoaded(true);
            }
        };
        fetchBookings();
    }, []);

    // Calculate statistics for regular listings
    const stats = useMemo(() => {
        if (!listings?.results) {
            return {
                total: 0,
                approved: 0,
                featured: 0,
                pending: 0,
                residential: 0,
                commercial: 0,
                land: 0,
                forSale: 0,
                forRent: 0,
            };
        }

        const results = listings.results;
        return {
            total: results.length,
            approved: results.filter(l => l.approved).length,
            featured: results.filter(l => l.featured).length,
            pending: results.filter(l => !l.approved).length,
            residential: results.filter(l => l.type === 'residential').length,
            commercial: results.filter(l => l.type === 'commercial').length,
            land: results.filter(l => l.type === 'land').length,
            forSale: results.filter(l => l.sale_type === 'sale').length,
            forRent: results.filter(l => l.sale_type === 'rent').length,
        };
    }, [listings]);

    // Calculate statistics for short-term listings
    const shortTermStats = useMemo(() => {
        if (!shortTermListingsData?.results) {
            return {
                total: 0,
                approved: 0,
                pending: 0,
            };
        }

        const results = shortTermListingsData.results;
        return {
            total: results.length,
            approved: results.filter(l => l.approved).length,
            pending: results.filter(l => !l.approved).length,
        };
    }, [shortTermListingsData]);

    // Calculate bookings stats
    const bookingsStats = useMemo(() => {
        if (!Array.isArray(bookings)) {
            return {
                total: 0,
                pending: 0,
            };
        }
        return {
            total: bookings.length,
            pending: bookings.filter(b => !b.admin_confirmed).length,
        };
    }, [bookings]);

    const totalOwners = owners?.length || 0;

    if (userStatus === false) {
        return <Forbidden403 />;
    }

    if (!listingsLoaded || !ownersLoaded || !shortTermLoaded || !bookingsLoaded) {
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
        <div style={{
            padding: '64px 24px 24px 24px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '12px' }}>
                <Title level={2} style={{ margin: 0, color: '#1f1f1f' }}>
                    {t('admin.dashboard.title')}
                </Title>
                <Text type="secondary">{t('admin.dashboard.welcomeMessage')}</Text>
            </div>

            {/* Main Stats Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.totalListings')}
                            value={stats.total}
                            prefix={<HomeOutlined style={{ color: '#1890ff' }} />}
                            styles={{ value: { color: '#1890ff', fontSize: '32px' } }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.approvedListings')}
                            value={stats.approved}
                            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            styles={{ value: { color: '#52c41a', fontSize: '32px' } }}
                            suffix={
                                <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                                    /{stats.total}
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.featuredListings')}
                            value={stats.featured}
                            prefix={<StarOutlined style={{ color: '#faad14' }} />}
                            styles={{ value: { color: '#faad14', fontSize: '32px' } }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title={t('admin.dashboard.pendingApproval')}
                            value={stats.pending}
                            prefix={<ClockCircleOutlined style={{ color: '#ff4d4f' }} />}
                            styles={{ value: { color: '#ff4d4f', fontSize: '32px' } }}
                        />
                    </Card>
                </Col>
            </Row>
            {/* Property Type Breakdown */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card
                        title={t('admin.dashboard.propertyTypes')}
                        extra={<FileTextOutlined />}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic
                                    title={t('propertyDetails.types.residential')}
                                    value={stats.residential}
                                    styles={{ value: { color: '#1890ff' } }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title={t('propertyDetails.types.commercial')}
                                    value={stats.commercial}
                                    styles={{ value: { color: '#52c41a' } }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title={t('propertyDetails.types.land')}
                                    value={stats.land}
                                    styles={{ value: { color: '#faad14' } }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={t('admin.dashboard.saleTypes')}
                        extra={<FileTextOutlined />}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title={t('propertyDetails.typeSale')}
                                    value={stats.forSale}
                                    styles={{ value: { color: '#13c2c2' } }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title={t('propertyDetails.typeRent')}
                                    value={stats.forRent}
                                    styles={{ value: { color: '#722ed1' } }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={t('admin.dashboard.shortTermRentals')}
                        extra={<CalendarOutlined />}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic
                                    title={t('admin.dashboard.total')}
                                    value={shortTermStats.total}
                                    styles={{ value: { color: '#fa8c16' } }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title={t('admin.dashboard.approved')}
                                    value={shortTermStats.approved}
                                    styles={{ value: { color: '#52c41a' } }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title={t('admin.dashboard.pending')}
                                    value={shortTermStats.pending}
                                    styles={{ value: { color: '#ff4d4f' } }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={t('admin.dashboard.bookings')}
                        extra={<CalendarOutlined />}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic
                                    title={t('admin.dashboard.totalBookings')}
                                    value={bookingsStats.total}
                                    styles={{ value: { color: '#722ed1' } }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title={t('admin.dashboard.pendingConfirmation')}
                                    value={bookingsStats.pending}
                                    styles={{ value: { color: '#ff4d4f' } }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card
                title={t('admin.dashboard.quickActions')}
                style={{ marginBottom: '24px' }}
            >
                <Space size="large" wrap>
                    <Link to="admin/listings/create">
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusCircleOutlined />}
                            style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                        >
                            {t('admin.dashboard.addNewListing')}
                        </Button>
                    </Link>
                    <Link to="/frontend/admin/listings">
                        <Button
                            size="large"
                            icon={<HomeOutlined />}
                        >
                            {t('admin.dashboard.viewAllListings')}
                        </Button>
                    </Link>
                    <Link to="/frontend/admin/short-term-listings">
                        <Button
                            size="large"
                            icon={<CalendarOutlined />}
                            style={{ borderColor: '#fa8c16', color: '#fa8c16' }}
                        >
                            {t('admin.dashboard.shortTermRentals')}
                        </Button>
                    </Link>
                    <Link to="/frontend/admin/bookings">
                        <Button
                            size="large"
                            icon={<CalendarOutlined />}
                            style={{ borderColor: '#722ed1', color: '#722ed1' }}
                        >
                            {t('admin.dashboard.viewBookings')}
                        </Button>
                    </Link>
                    <Link to="/frontend/admin/contact_list">
                        <Button
                            size="large"
                            icon={<MessageOutlined />}
                        >
                            {t('admin.dashboard.viewMessages')}
                        </Button>
                    </Link>
                </Space>
            </Card>

            {/* Management Links */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={6}>
                    <Card hoverable>
                        <Link to="/frontend/admin/listings" style={{ textDecoration: 'none' }}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <HomeOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                                <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                    {t("admin.dashboard.manageListings")}
                                </Title>
                                <Text type="secondary">
                                    {t('admin.dashboard.viewEditManageListings')}
                                </Text>
                            </div>
                        </Link>
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <Card hoverable>
                        <Link to="/frontend/admin/short-term-listings" style={{ textDecoration: 'none' }}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <HomeOutlined style={{ fontSize: '48px', color: '#fa8c16', marginBottom: '16px' }} />
                                <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                    {t('admin.dashboard.manageShortTermRentals')}
                                </Title>
                                <Text type="secondary">
                                    {shortTermStats.total} {t('admin.dashboard.shortTermListings')}
                                </Text>
                            </div>
                        </Link>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <Card hoverable>
                        <Link to="/frontend/admin/bookings" style={{ textDecoration: 'none' }}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <CalendarOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
                                <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                    {t('admin.dashboard.manageBookings')}
                                </Title>
                                <Text type="secondary">
                                    {bookingsStats.total} {t('admin.dashboard.totalBookings')} • {bookingsStats.pending} {t('admin.dashboard.pendingBookings')}
                                </Text>
                            </div>
                        </Link>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={6}>
                    <Card hoverable>
                        <Link to="/frontend/admin/listings/owners" style={{ textDecoration: 'none' }}>
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <UserOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                                <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                    {t('admin.dashboard.manageOwners')}
                                </Title>
                                <Text type="secondary">
                                    {t('admin.dashboard.totalOwners')}: {totalOwners}
                                </Text>
                            </div>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;