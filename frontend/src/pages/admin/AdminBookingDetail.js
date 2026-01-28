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

const BookingDetail = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const history = useHistory();
    const { message } = App.useApp();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const { data } = await axiosReq.get(`/short-term-bookings/${id}/`);
                setBooking(data);
                setHasLoaded(true);
            } catch (err) {
                console.error('Error fetching booking:', err);
                message.error('Failed to load booking details');
                setHasLoaded(true);
            }
        };
        fetchBooking();
    }, [id, message]);

    const handleConfirm = async () => {
        try {
            const { data } = await axiosReq.patch(`/short-term-bookings/${id}/status/`, {
                status: 'confirmed',
            });
            setBooking(data);
            message.success('Booking confirmed successfully!');
        } catch (err) {
            console.error('Error confirming booking:', err);
            message.error('Failed to confirm booking');
        }
    };

    const handleDelete = async () => {
        try {
            await axiosReq.delete(`/short-term-bookings/${id}/`);
            message.success('Booking deleted successfully!');
            history.push('/frontend/admin/bookings');
        } catch (err) {
            console.error('Error deleting booking:', err);
            message.error('Failed to delete booking');
        }
    };

    if (!hasLoaded) {
        return <div style={{ padding: '24px' }}>Loading...</div>;
    }

    if (!booking) {
        return <div style={{ padding: '24px' }}>Booking not found</div>;
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
                            Back
                        </Button>
                        <h2 style={{ margin: 0 }}>Booking Details</h2>
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
                                Confirm Booking
                            </Button>
                        )}
                        <Popconfirm
                            title="Delete Booking"
                            description="Are you sure you want to delete this booking?"
                            onConfirm={handleDelete}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger icon={<DeleteOutlined />} size="large">
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>

                {/* Status & Key Info */}
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Reference"
                                value={booking.reference_number}
                                styles={{ fontSize: '16px', color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '8px', color: '#888' }}>Status</div>
                                {booking.admin_confirmed ? (
                                    <Tag icon={<CheckCircleOutlined />} color="success" style={{ fontSize: '16px', padding: '8px 16px' }}>
                                        Confirmed
                                    </Tag>
                                ) : (
                                    <Tag icon={<ClockCircleOutlined />} color="warning" style={{ fontSize: '16px', padding: '8px 16px' }}>
                                        Pending
                                    </Tag>
                                )}
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Nights"
                                value={totalNights}
                                suffix="nights"
                                prefix={<CalendarOutlined />}
                                styles={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Guests"
                                value={totalGuests}
                                suffix={`(${booking.adults}A, ${booking.children}C)`}
                                prefix={<UserOutlined />}
                                styles={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Guest Information */}
                <Card title="Guest Information" style={{ marginBottom: '24px' }}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Full Name" span={2}>
                            <strong>{booking.first_name} {booking.last_name}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={<><MailOutlined /> Email</>}>
                            <a href={`mailto:${booking.email}`}>{booking.email}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                            <a href={`tel:${booking.phone_number}`}>{booking.phone_number}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Language">
                            {booking.language === 'en' ? 'English' : 'Greek'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Adults">
                            {booking.adults || 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="Children">
                            {booking.children || 0}
                        </Descriptions.Item>
                        {booking.message && (
                            <Descriptions.Item label="Message" span={2}>
                                {booking.message}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </Card>

                {/* Stay Details */}
                <Card title="Stay Details" style={{ marginBottom: '24px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card>
                                <Statistic
                                    title="Check-in"
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
                                    title="Check-out"
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
                        {isUpcoming && <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>Upcoming Stay</Tag>}
                        {isPast && <Tag color="default" style={{ fontSize: '14px', padding: '4px 12px' }}>Past Stay</Tag>}
                    </div>
                </Card>

                {/* Price Breakdown */}
                <Card
                    title={
                        <span>
                            <EuroOutlined style={{ marginRight: '8px' }} />
                            Price Breakdown
                        </span>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Subtotal (Accommodation)">
                            €{parseFloat(booking.subtotal || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="VAT (13%)">
                            €{parseFloat(booking.vat || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Municipality Tax">
                            €{parseFloat(booking.municipality_tax || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Climate Crisis Fee">
                            €{parseFloat(booking.climate_crisis_fee || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Cleaning Fee">
                            €{parseFloat(booking.cleaning_fee || 0).toFixed(2)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Service Fee">
                            €{parseFloat(booking.service_fee || 0).toFixed(2)}
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <div style={{ textAlign: 'right', fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                        Total: €{parseFloat(booking.total_price || 0).toFixed(2)}
                    </div>
                </Card>

                {/* Listing Information */}
                <Card
                    title={
                        <span>
                            <HomeOutlined style={{ marginRight: '8px' }} />
                            Property Information
                        </span>
                    }
                >
                    <Descriptions bordered>
                        <Descriptions.Item label="Listing ID">
                            {booking.listing}
                        </Descriptions.Item>
                        <Descriptions.Item label="Booked On">
                            {dayjs(booking.created_at).format('MMMM DD, YYYY HH:mm')}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </div>
    );
};

export default BookingDetail;
