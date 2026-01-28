import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Input,
    Space,
    Button,
    Tag,
    Typography,
    Card,
    Row,
    Col,
    Modal,
    Select,
    Divider,
    Tooltip,
    Popconfirm,
    Spin,
    InputNumber
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
    PercentageOutlined,
    LoadingOutlined,
    GiftOutlined
} from '@ant-design/icons';
import { useRedirect } from '../../hooks/useRedirect';
import useUserStatus from '../../hooks/useUserStatus';
import Forbidden403 from '../errors/Forbidden403';
import { axiosReq } from "../../api/axiosDefaults";
import dayjs from 'dayjs';
import { App } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function AdminBookings() {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    const history = useHistory();
    const { message } = App.useApp();

    // UI State
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('descend');

    // Modals
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [discountModalVisible, setDiscountModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [discountData, setDiscountData] = useState({
        discount_type: 'percentage',
        discount_value: '',
        discount_reason: ''
    });

    // Data State
    const [allBookings, setAllBookings] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    // Refs
    const searchTimeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    // Initial fetch
    useEffect(() => {
        fetchBookings();
        fetchStatistics();
        return () => { isMountedRef.current = false; };
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchBookings(inputValue);
            setCurrentPage(1);
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [inputValue]);

    const fetchBookings = async (search = '') => {
        try {
            setSearching(true);
            const url = search
                ? `/short-term-bookings/?search=${encodeURIComponent(search)}`
                : `/short-term-bookings/`;

            const { data } = await axiosReq.get(url);

            if (isMountedRef.current) {
                setAllBookings(data.results || []);
                setLoading(false);
                setSearching(false);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            if (isMountedRef.current) {
                setLoading(false);
                setSearching(false);
            }
        }
    };

    const fetchStatistics = async () => {
        try {
            const { data } = await axiosReq.get('/short-term-bookings/statistics/');
            if (isMountedRef.current) {
                setStatistics(data);
            }
        } catch (err) {
            console.error('Stats error:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosReq.delete(`/short-term-bookings/${id}/`);
            message.success('Booking deleted successfully!');
            fetchBookings(inputValue);
            fetchStatistics();
        } catch (error) {
            console.error('Delete error:', error);
            message.error('Failed to delete booking');
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedBooking || !newStatus) return;

        try {
            await axiosReq.patch(`/short-term-bookings/${selectedBooking.id}/status/`, {
                status: newStatus
            });

            message.success('Status updated successfully!');
            setStatusModalVisible(false);
            setSelectedBooking(null);
            setNewStatus('');
            fetchBookings(inputValue);
            fetchStatistics();
        } catch (err) {
            console.error('Status update error:', err);
            message.error('Failed to update status');
        }
    };

    const handleApplyDiscount = async () => {
        if (!selectedBooking || !discountData.discount_value) {
            message.error('Please enter a discount value');
            return;
        }

        try {
            await axiosReq.post(`/short-term-bookings/${selectedBooking.id}/apply-discount/`, {
                discount_type: discountData.discount_type,
                discount_value: parseFloat(discountData.discount_value),
                discount_reason: discountData.discount_reason
            });

            message.success('Discount applied successfully!');
            setDiscountModalVisible(false);
            setSelectedBooking(null);
            setDiscountData({ discount_type: 'percentage', discount_value: '', discount_reason: '' });
            fetchBookings(inputValue);
            fetchStatistics();
        } catch (err) {
            console.error('Discount error:', err);
            message.error(err.response?.data?.error || 'Failed to apply discount');
        }
    };

    const handleRemoveDiscount = async (bookingId) => {
        try {
            await axiosReq.post(`/short-term-bookings/${bookingId}/remove-discount/`);
            message.success('Discount removed successfully!');
            fetchBookings(inputValue);
            fetchStatistics();
        } catch (err) {
            console.error('Remove discount error:', err);
            message.error('Failed to remove discount');
        }
    };

    // Process bookings
    const processedBookings = useMemo(() => {
        if (!allBookings.length) return [];

        let result = [...allBookings];

        result.sort((a, b) => {
            let aVal, bVal;

            switch (sortField) {
                case 'id':
                    aVal = a.id || 0;
                    bVal = b.id || 0;
                    break;
                case 'check_in':
                    aVal = new Date(a.check_in || 0);
                    bVal = new Date(b.check_in || 0);
                    break;
                case 'total_nights':
                    aVal = a.total_nights || 0;
                    bVal = b.total_nights || 0;
                    break;
                case 'total_price':
                    aVal = parseFloat(a.total_price || 0);
                    bVal = parseFloat(b.total_price || 0);
                    break;
                case 'guest':
                    aVal = (a.first_name || '').toLowerCase();
                    bVal = (b.first_name || '').toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (sortOrder === 'ascend') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        return result;
    }, [allBookings, sortField, sortOrder]);

    const paginatedBookings = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return processedBookings.slice(startIndex, endIndex);
    }, [processedBookings, currentPage, pageSize]);

    const stats = useMemo(() => {
        if (!allBookings.length) return { total: 0, confirmed: 0, pending: 0, upcoming: 0, revenue: 0 };

        const now = dayjs();

        return {
            total: allBookings.length,
            confirmed: allBookings.filter(b => b.status === 'confirmed' || b.admin_confirmed).length,
            pending: allBookings.filter(b => b.status === 'pending' || (!b.admin_confirmed && b.status !== 'confirmed')).length,
            upcoming: allBookings.filter(b => {
                if (!b.check_in) return false;
                try {
                    return dayjs(b.check_in).isAfter(now);
                } catch {
                    return false;
                }
            }).length,
            revenue: allBookings
                .filter(b => b.status === 'confirmed' || b.admin_confirmed)
                .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0),
        };
    }, [allBookings]);

    const getStatusTag = (record) => {
        const status = record.status || (record.admin_confirmed ? 'confirmed' : 'pending');

        const statusConfig = {
            pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
            confirmed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Confirmed' },
            checked_in: { color: 'processing', icon: <CalendarOutlined />, text: 'Checked In' },
            completed: { color: 'default', icon: <CheckCircleOutlined />, text: 'Completed' },
            cancelled: { color: 'error', icon: <DeleteOutlined />, text: 'Cancelled' },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <Tag icon={config.icon} color={config.color}>{config.text}</Tag>;
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend');
        } else {
            setSortField(field);
            setSortOrder('ascend');
        }
    };

    const totalPages = Math.ceil(processedBookings.length / pageSize);
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, processedBookings.length);

    if (userStatus === false) {
        return <Forbidden403 />;
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '94px 24px 24px 24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: '24px', color: '#1f1f1f' }}>
                Bookings Management
            </Title>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                                {stats.total}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>Total Bookings</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                                {stats.confirmed}
                            </div>
                            <div style={{ value: { color: '#8c8c8c' } }}>Confirmed</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#faad14' }}>
                                {stats.pending}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>Pending</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>
                                €{stats.revenue.toFixed(2)}
                            </div>
                            <div style={{ color: '#8c8c8c' }}>Total Revenue</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Detailed Statistics */}
            {statistics && (
                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col xs={24}>
                        <Card title="Detailed Statistics">
                            <Row gutter={16}>
                                <Col xs={12} sm={6}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                            {statistics.with_discount || 0}
                                        </div>
                                        <div style={{ color: '#8c8c8c' }}>With Discount</div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                            €{parseFloat(statistics.total_discounts_given || 0).toFixed(2)}
                                        </div>
                                        <div style={{ color: '#8c8c8c' }}>Total Discounts</div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                            {statistics.by_status?.checked_in || 0}
                                        </div>
                                        <div style={{ color: '#8c8c8c' }}>Checked In</div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                            {statistics.by_status?.completed || 0}
                                        </div>
                                        <div style={{ color: '#8c8c8c' }}>Completed</div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Search Bar */}
            <div style={{ marginBottom: '16px' }}>
                <Input
                    placeholder="Search by ID, reference, name, email, or phone..."
                    prefix={<SearchOutlined />}
                    suffix={searching ? <LoadingOutlined style={{ color: '#1890ff' }} /> : null}
                    allowClear
                    size="large"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ maxWidth: '600px' }}
                />
            </div>

            {/* Table Card */}
            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#fafafa',
                                borderBottom: '1px solid #f0f0f0',
                            }}>
                                <th onClick={() => handleSort('id')} style={headerStyle}>
                                    ID {sortField === 'id' && (sortOrder === 'ascend' ? '↑' : '↓')}
                                </th>
                                <th style={headerStyle}>Reference</th>
                                <th onClick={() => handleSort('guest')} style={headerStyle}>
                                    Guest {sortField === 'guest' && (sortOrder === 'ascend' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('check_in')} style={headerStyle}>
                                    Check-in {sortField === 'check_in' && (sortOrder === 'ascend' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('total_nights')} style={headerStyle}>
                                    Nights {sortField === 'total_nights' && (sortOrder === 'ascend' ? '↑' : '↓')}
                                </th>
                                <th style={headerStyle}>Guests</th>
                                <th onClick={() => handleSort('total_price')} style={headerStyle}>
                                    Price {sortField === 'total_price' && (sortOrder === 'ascend' ? '↑' : '↓')}
                                </th>
                                <th style={headerStyle}>Status</th>
                                <th style={headerStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBookings.map((booking, index) => (
                                <tr
                                    key={booking.id}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                                        borderBottom: '1px solid #f0f0f0',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#fafafa'}
                                >
                                    <td style={cellStyle}>
                                        <strong>#{booking.id}</strong>
                                    </td>
                                    <td style={cellStyle}>
                                        <Tag color="blue">{booking.reference_number}</Tag>
                                    </td>
                                    <td style={cellStyle}>
                                        <div>
                                            <div><strong>{booking.first_name} {booking.last_name}</strong></div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{booking.email}</div>
                                        </div>
                                    </td>
                                    <td style={cellStyle}>
                                        {dayjs(booking.check_in).format('MMM DD, YYYY')}
                                    </td>
                                    <td style={cellStyle}>
                                        <Tag color="purple">{booking.total_nights}</Tag>
                                    </td>
                                    <td style={cellStyle}>
                                        <Space size="small">
                                            <UserOutlined />
                                            {booking.adults + booking.children}
                                            <span style={{ fontSize: '11px', color: '#888' }}>
                                                ({booking.adults}A, {booking.children}C)
                                            </span>
                                        </Space>
                                    </td>
                                    <td style={cellStyle}>
                                        <div>
                                            <strong style={{ color: '#52c41a', fontSize: '14px' }}>
                                                €{parseFloat(booking.total_price).toFixed(2)}
                                            </strong>
                                            {booking.has_discount && (
                                                <div style={{ marginTop: '4px' }}>
                                                    <Tooltip title={`Discount: ${booking.discount_type_display} - ${booking.discount_reason || 'No reason'}`}>
                                                        <Tag color="orange" icon={<PercentageOutlined />} style={{ fontSize: '10px' }}>
                                                            -{booking.discount_type_display.replace(/off/g, ' ')}
                                                        </Tag>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={cellStyle}>
                                        {getStatusTag(booking)}
                                    </td>
                                    <td style={cellStyle}>
                                        <Space size="small" wrap>
                                            <Tooltip title="View">
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    icon={<EyeOutlined />}
                                                    onClick={() => history.push(`/frontend/admin/bookings/${booking.id}`)}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Change Status">
                                                <Button
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setNewStatus(booking.status || (booking.admin_confirmed ? 'confirmed' : 'pending'));
                                                        setStatusModalVisible(true);
                                                    }}
                                                />
                                            </Tooltip>

                                            {/* Discount buttons */}
                                            {!booking.has_discount ? (
                                                <Tooltip title="Apply Discount">
                                                    <Button
                                                        size="small"
                                                        icon={<GiftOutlined />}
                                                        style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setDiscountModalVisible(true);
                                                        }}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <Popconfirm
                                                    title="Remove discount?"
                                                    description={`This will remove the €${parseFloat(booking.discount_amount || 0).toFixed(2)} discount.`}
                                                    onConfirm={() => handleRemoveDiscount(booking.id)}
                                                    okText="Yes, remove"
                                                    cancelText="Cancel"
                                                >
                                                    <Tooltip title="Remove Discount">
                                                        <Button
                                                            size="small"
                                                            danger
                                                            icon={<PercentageOutlined />}
                                                        />
                                                    </Tooltip>
                                                </Popconfirm>
                                            )}

                                            <Popconfirm
                                                title="Delete this booking?"
                                                description="This action cannot be undone."
                                                onConfirm={() => handleDelete(booking.id)}
                                                okText="Yes, delete"
                                                cancelText="Cancel"
                                            >
                                                <Tooltip title="Delete">
                                                    <Button danger size="small" icon={<DeleteOutlined />} />
                                                </Tooltip>
                                            </Popconfirm>
                                        </Space>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    padding: '8px 0',
                }}>
                    <div style={{ color: '#595959' }}>
                        Showing {processedBookings.length > 0 ? startRecord : 0}-{endRecord} of {processedBookings.length} bookings
                    </div>

                    <Space>
                        <Select
                            value={pageSize}
                            onChange={(value) => {
                                setPageSize(value);
                                setCurrentPage(1);
                            }}
                            style={{ width: 120 }}
                        >
                            <Option value={10}>10 / page</Option>
                            <Option value={20}>20 / page</Option>
                            <Option value={50}>50 / page</Option>
                            <Option value={100}>100 / page</Option>
                        </Select>

                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </Button>

                        <span style={{ padding: '0 8px' }}>
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <Button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Status Update Modal */}
            <Modal
                title="Update Booking Status"
                open={statusModalVisible}
                onOk={handleUpdateStatus}
                onCancel={() => {
                    setStatusModalVisible(false);
                    setSelectedBooking(null);
                    setNewStatus('');
                }}
                okText="Update"
            >
                {selectedBooking && (
                    <>
                        <p>Booking: <strong>#{selectedBooking.id} - {selectedBooking.reference_number}</strong></p>
                        <p>Guest: <strong>{selectedBooking.first_name} {selectedBooking.last_name}</strong></p>
                        <Divider />
                        <div style={{ marginBottom: '16px' }}>
                            <label>New Status:</label>
                            <Select
                                style={{ width: '100%', marginTop: '8px' }}
                                value={newStatus}
                                onChange={setNewStatus}
                            >
                                <Option value="pending">Pending</Option>
                                <Option value="confirmed">Confirmed</Option>
                                <Option value="checked_in">Checked In</Option>
                                <Option value="completed">Completed</Option>
                                <Option value="cancelled">Cancelled</Option>
                            </Select>
                        </div>
                    </>
                )}
            </Modal>

            {/* Discount Modal */}
            <Modal
                title={
                    <Space>
                        <GiftOutlined style={{ color: '#fa8c16' }} />
                        <span>Apply Discount</span>
                    </Space>
                }
                open={discountModalVisible}
                onOk={handleApplyDiscount}
                onCancel={() => {
                    setDiscountModalVisible(false);
                    setSelectedBooking(null);
                    setDiscountData({ discount_type: 'percentage', discount_value: '', discount_reason: '' });
                }}
                okText="Apply Discount"
                okButtonProps={{ icon: <GiftOutlined /> }}
            >
                {selectedBooking && (
                    <>
                        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                            <Text strong>Booking #{selectedBooking.id}</Text>
                            <div style={{ marginTop: '8px' }}>
                                <Text type="secondary">{selectedBooking.first_name} {selectedBooking.last_name}</Text>
                            </div>
                            <div style={{ marginTop: '4px' }}>
                                <Text type="secondary">Current Price: </Text>
                                <Text strong style={{ color: '#52c41a' }}>€{parseFloat(selectedBooking.total_price).toFixed(2)}</Text>
                            </div>
                        </div>

                        <Divider />

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Discount Type:</label>
                            <Select
                                style={{ width: '100%' }}
                                value={discountData.discount_type}
                                onChange={(value) => setDiscountData({ ...discountData, discount_type: value })}
                            >
                                <Option value="percentage">Percentage (%)</Option>
                                <Option value="fixed">Fixed Amount (€)</Option>
                            </Select>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                                Discount Value:
                            </label>
                            <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                max={discountData.discount_type === 'percentage' ? 100 : parseFloat(selectedBooking.total_price)}
                                precision={2}
                                value={discountData.discount_value}
                                onChange={(value) => setDiscountData({ ...discountData, discount_value: value })}
                                prefix={discountData.discount_type === 'percentage' ? '%' : '€'}
                            />
                            {discountData.discount_value && (
                                <div style={{ marginTop: '8px', color: '#fa8c16' }}>
                                    <Text type="secondary">
                                        New price: €
                                        {discountData.discount_type === 'percentage'
                                            ? (parseFloat(selectedBooking.total_price) * (1 - discountData.discount_value / 100)).toFixed(2)
                                            : (parseFloat(selectedBooking.total_price) - discountData.discount_value).toFixed(2)
                                        }
                                    </Text>
                                </div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                                Reason (optional):
                            </label>
                            <TextArea
                                rows={3}
                                placeholder="e.g., Early bird discount, Repeat customer, Special promotion..."
                                value={discountData.discount_reason}
                                onChange={(e) => setDiscountData({ ...discountData, discount_reason: e.target.value })}
                            />
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}

// Styles
const headerStyle = {
    padding: '16px',
    textAlign: 'left',
    fontWeight: 600,
    color: 'rgba(0, 0, 0, 0.85)',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.3s',
};

const cellStyle = {
    padding: '16px',
    borderBottom: '1px solid #f0f0f0',
};