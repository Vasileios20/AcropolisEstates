import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
    Card,
    Descriptions,
    Button,
    Space,
    Tag,
    Divider,
    Popconfirm,
    Row,
    Col,
    Statistic,
} from 'antd';
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    CheckOutlined,
    EuroOutlined,
    CalendarOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { axiosReq } from "../../api/axiosDefaults";
import dayjs from 'dayjs';
import { App } from 'antd';
import { useTranslation } from "react-i18next";

const BookingDetail = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const history = useHistory();
    const { message } = App.useApp();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const { data } = await axiosReq.get(`/short-term-bookings/${id}/`);
                setBooking(data);
                setHasLoaded(true);
            } catch (err) {
                console.error('Error fetching booking:', err);
                message.error(t('admin.bookings.failedToLoadBookingDetails'));
                setHasLoaded(true);
            }
        };
        fetchBooking();
    }, [id, message, t]);

    const handleConfirm = async () => {
        try {
            const { data } = await axiosReq.patch(`/short-term-bookings/${id}/status/`, {
                status: 'confirmed',
            });
            setBooking(data);
            message.success(t('admin.bookings.bookingConfirmedSuccessfully'));
        } catch (err) {
            console.error('Error confirming booking:', err);
            message.error(t('admin.bookings.failedToConfirmBooking'));
        }
    };

    const handleDelete = async () => {
        try {
            await axiosReq.delete(`/short-term-bookings/${id}/`);
            message.success(t('admin.bookings.bookingDeletedSuccessfully'));
            history.push('/frontend/admin/bookings');
        } catch (err) {
            console.error('Error deleting booking:', err);
            message.error(t('admin.bookings.failedToDeleteBooking'));
        }
    };

    if (!hasLoaded) {
        return <div style={{ padding: '24px' }}>{t('admin.bookings.loading')}</div>;
    }

    if (!booking) {
        return <div style={{ padding: '24px' }}>{t('admin.bookings.bookingNotFound')}</div>;
    }

    const isUpcoming = dayjs(booking.check_in).isAfter(dayjs());
    const isPast = dayjs(booking.check_out).isBefore(dayjs());
    const totalNights = booking.total_nights || 0;
    const totalGuests = (booking.adults || 0) + (booking.children || 0);

    return (
        <div style={{ padding: '94px 24px 24px 24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => history.goBack()}
                        >
                            {t('admin.bookings.back')}
                        </Button>
                        <h2 style={{ margin: 0 }}>{t('admin.bookings.bookingDetails')}</h2>
                    </Space>
                    <Space>
                        {!booking.admin_confirmed && (
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={handleConfirm}
                                size="large"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            >
                                {t('admin.bookings.confirmBooking')}
                            </Button>
                        )}
                        <Popconfirm
                            title={t('admin.bookings.deleteBooking')}
                            description={t('admin.bookings.deleteBookingConfirmation')}
                            onConfirm={handleDelete}
                            okText={t('admin.bookings.yes')}
                            cancelText={t('admin.bookings.no')}
                        >
                            <Button danger icon={<DeleteOutlined />} size="large">
                                {t('admin.bookings.delete')}
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>

                {/* Status & Key Info */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title={t('admin.bookings.booking')}
                                value={booking.reference_number}
                                styles={{ fontSize: '16px', color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '8px', color: '#888' }}>{t('admin.bookings.status')}</div>
                                {booking.admin_confirmed ? (
                                    <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: '16px', padding: '8px 16px' }}>
                                        {t('admin.bookings.confirmed')}
                                    </Tag>
                                ) : (
                                    <Tag icon={<ClockCircleOutlined />} color="warning" style={{ fontSize: '16px', padding: '8px 16px' }}>
                                        {t('admin.bookings.pending')}
                                    </Tag>
                                )}
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title={t('admin.bookings.totalNights')}
                                value={totalNights}
                                suffix={t('admin.bookings.nights')}
                                prefix={<CalendarOutlined />}
                                styles={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title={t('admin.bookings.totalGuests')}
                                value={totalGuests}
                                suffix={`(${booking.adults}A, ${booking.children}C)`}
                                prefix={<UserOutlined />}
                                styles={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Guest Information */}
                <Card title={t('admin.bookings.guestInformation')} style={{ marginBottom: '24px' }}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label={t('admin.bookings.fullName')} span={2}>
                            <strong>{booking.first_name} {booking.last_name}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={<><MailOutlined /> {t('bookingForm.email')}</>}>
                            <a href={`mailto:${booking.email}`}>{booking.email}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label={<><PhoneOutlined /> {t('bookingForm.phone')}</>}>
                            <a href={`tel:${booking.phone_number}`}>{booking.phone_number}</a>
                        </Descriptions.Item>
                        {/* <Descriptions.Item label={t('bookingForm.language')}>
                            {booking.language === 'en' ? t('bookingForm.english') : t('bookingForm.greek')}
                        </Descriptions.Item> */}
                        <Descriptions.Item label={t('bookingForm.adults')}>
                            {booking.adults || 0}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingForm.children')}>
                            {booking.children || 0}
                        </Descriptions.Item>
                        {booking.message && (
                            <Descriptions.Item label={t('bookingForm.message')} span={2}>
                                {booking.message}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>

                {/* Stay Details */}
                <Card title={t('admin.bookings.stayDetails')} style={{ marginBottom: '24px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title={t('admin.bookings.checkIn')}
                                    value={dayjs(booking.check_in).format('MMMM DD, YYYY')}
                                    styles={{ fontSize: '18px', color: '#52c41a' }}
                                />
                                <div style={{ marginTop: '8px', color: '#888' }}>
                                    {dayjs(booking.check_in).format('dddd')}
                                </div>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title={t('admin.bookings.checkOut')}
                                    value={dayjs(booking.check_out).format('MMMM DD, YYYY')}
                                    styles={{ fontSize: '18px', color: '#ff4d4f' }}
                                />
                                <div style={{ marginTop: '8px', color: '#888' }}>
                                    {dayjs(booking.check_out).format('dddd')}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        {isUpcoming && <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>{t('admin.bookings.upcomingStay')}</Tag>}
                        {isPast && <Tag color="default" style={{ fontSize: '14px', padding: '4px 12px' }}>{t('admin.bookings.pastStay')}</Tag>}
                    </div>
                </Card>

                {/* Price Breakdown */}
                <Card
                    title={
                        <span>
                            <EuroOutlined style={{ marginRight: '8px' }} />
                            {t('admin.bookings.priceBreakdown')}
                        </span>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label={t('admin.bookings.subtotal')}>
                            €{parseFloat(booking.subtotal || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingForm.vat')}>
                            €{parseFloat(booking.vat || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingForm.municipalityTax')}>
                            €{parseFloat(booking.municipality_tax || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingForm.climateFee')}>
                            €{parseFloat(booking.climate_crisis_fee || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingForm.cleaningFee')}>
                            €{parseFloat(booking.cleaning_fee || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingForm.serviceFee')}>
                            €{parseFloat(booking.service_fee || 0).toFixed(2)}
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <div style={{ textAlign: 'right', fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                        {t('bookingForm.total')}: €{parseFloat(booking.total_price || 0).toFixed(2)}
                    </div>
                </Card>

                {/* Listing Information */}
                <Card
                    title={
                        <span>
                            <HomeOutlined style={{ marginRight: '8px' }} />
                            {t('admin.bookings.propertyInformation')}
                        </span>
                    }
                >
                    <Descriptions bordered>
                        <Descriptions.Item label={t('admin.bookings.listingId')}>
                            {booking.listing}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('admin.bookings.bookedOn')}>
                            {dayjs(booking.created_at).format('MMMM DD, YYYY HH:mm')}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </div>
    );
};

export default BookingDetail;
