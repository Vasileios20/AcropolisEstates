import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
    Table,
    Input,
    DatePicker,
    Button,
    Space,
    Card,
    Typography,
    Tag,
    Dropdown,
    Menu,
    Modal,
    Select
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    CalendarOutlined,
    MailOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    MoreOutlined
} from '@ant-design/icons';
import useUserStatus from "../../hooks/useUserStatus";
import Forbidden403 from "../errors/Forbidden403";
import Asset from "../../components/Asset";
import { App } from 'antd';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const ContactMessagesList = () => {
    const status = useUserStatus();
    const [contactList, setContactList] = useState({ results: [] });
    const [query, setQuery] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const history = useHistory();

    const { message: antMessage } = App.useApp();

    const fetchContactList = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosReq.get("/contact_list");
            // Add status to each message (simulated - you'd get this from backend)
            const messagesWithStatus = data.results.map(msg => ({
                ...msg,
                status: msg.status || 'new', // 'new', 'read', 'replied', 'archived'
            }));
            setContactList({ ...data, results: messagesWithStatus });
        } catch (err) {
            if (err.response?.status === 403) {
                history.push("/forbidden");
            }
            antMessage.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, [history, antMessage]);

    useEffect(() => {
        fetchContactList();
    }, [fetchContactList]);


    const handleSearch = async () => {
        let path = `/contact_list/?`;

        if (query) {
            path += `&search=${query}`;
        }

        if (dateRange[0] && dateRange[1]) {
            path += `&min_created_on=${dateRange[0].format('YYYY-MM-DD')}`;
            path += `&max_created_on=${dateRange[1].format('YYYY-MM-DD')}`;
        } else if (dateRange[0]) {
            path += `&min_created_on=${dateRange[0].format('YYYY-MM-DD')}`;
            const nextDay = dateRange[0].add(1, 'day').format('YYYY-MM-DD');
            path += `&max_created_on=${nextDay}`;
        }

        try {
            setLoading(true);
            const { data } = await axiosReq.get(path);
            const messagesWithStatus = data.results.map(msg => ({
                ...msg,
                status: msg.status || 'new',
            }));
            setContactList({ ...data, results: messagesWithStatus });
            antMessage.success('Search completed');
        } catch (err) {
            if (err.response?.status === 403) {
                history.push("/forbidden");
            }
            antMessage.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setQuery("");
        setDateRange([null, null]);
        setStatusFilter('all');
        fetchContactList();
    };

    const handleMarkAsRead = async (record) => {
        try {
            // Update status in backend (you'll need to implement this endpoint)
            // await axiosReq.patch(`/contact_list/${record.id}/`, { status: 'read' });

            // Update local state
            const updatedMessages = contactList.results.map(msg =>
                msg.id === record.id ? { ...msg, status: 'read' } : msg
            );
            setContactList({ ...contactList, results: updatedMessages });
            antMessage.success('Marked as read');
        } catch (err) {
            antMessage.error('Failed to update status');
        }
    };

    const handleDelete = (record) => {
        confirm({
            title: 'Delete Message',
            content: `Are you sure you want to delete the message from ${record.first_name} ${record.last_name}?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axiosReq.delete(`/contact_list/${record.id}/`);
                    const updatedMessages = contactList.results.filter(msg => msg.id !== record.id);
                    setContactList({ ...contactList, results: updatedMessages });
                    antMessage.success('Message deleted');
                } catch (err) {
                    antMessage.error('Failed to delete message');
                }
            },
        });
    };

    const handleBulkAction = (action) => {
        if (selectedRowKeys.length === 0) {
            antMessage.warning('Please select messages first');
            return;
        }

        confirm({
            title: `${action} Selected Messages`,
            content: `Are you sure you want to ${action.toLowerCase()} ${selectedRowKeys.length} message(s)?`,
            onOk: async () => {
                try {
                    // Implement bulk operations on backend
                    // await axiosReq.post(`/contact_list/bulk-${action.toLowerCase()}/`, { ids: selectedRowKeys });

                    if (action === 'Delete') {
                        const updatedMessages = contactList.results.filter(
                            msg => !selectedRowKeys.includes(msg.id)
                        );
                        setContactList({ ...contactList, results: updatedMessages });
                    }

                    setSelectedRowKeys([]);
                    antMessage.success(`${action} completed`);
                } catch (err) {
                    antMessage.error(`Failed to ${action.toLowerCase()}`);
                }
            },
        });
    };

    const getActionMenu = (record) => (
        <Menu>
            <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => history.push(`/frontend/admin/contact_list/${record.id}`)}
            >
                View
            </Menu.Item>
            <Menu.Item
                key="read"
                icon={<CheckCircleOutlined />}
                onClick={() => handleMarkAsRead(record)}
                disabled={record.status === 'read'}
            >
                Mark as Read
            </Menu.Item>
            <Menu.Item
                key="reply"
                icon={<MailOutlined />}
                onClick={() => window.location.href = `mailto:${record.email}?subject=Re: ${record.subject}`}
            >
                Reply
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record)}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    const getStatusTag = (status) => {
        const statusConfig = {
            new: { color: 'blue', text: 'New' },
            read: { color: 'default', text: 'Read' },
            replied: { color: 'green', text: 'Replied' },
            archived: { color: 'orange', text: 'Archived' },
        };

        const config = statusConfig[status] || statusConfig.new;
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    // Filter messages by status
    const filteredMessages = useMemo(() => {
        if (statusFilter === 'all') return contactList.results || [];
        return contactList.results?.filter(msg => msg.status === statusFilter) || [];
    }, [contactList, statusFilter]);

    // Stats
    const stats = useMemo(() => {
        const messages = contactList.results || [];
        return {
            total: messages.length,
            new: messages.filter(m => m.status === 'new').length,
            read: messages.filter(m => m.status === 'read').length,
            replied: messages.filter(m => m.status === 'replied').length,
        };
    }, [contactList]);

    const columns = [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => getStatusTag(status),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Name',
            key: 'name',
            width: 150,
            render: (_, record) => (
                <div>
                    <strong>{record.first_name} {record.last_name}</strong>
                </div>
            ),
            sorter: (a, b) => {
                const nameA = `${a.first_name} ${a.last_name}`;
                const nameB = `${b.first_name} ${b.last_name}`;
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            ellipsis: true,
            render: (email) => (
                <a href={`mailto:${email}`}>
                    <MailOutlined style={{ marginRight: '8px' }} />
                    {email}
                </a>
            ),
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            ellipsis: true,
            render: (subject) => (
                <Text ellipsis style={{ maxWidth: '250px' }}>
                    {subject}
                </Text>
            ),
        },
        {
            title: 'Message Preview',
            dataIndex: 'message',
            key: 'message',
            ellipsis: true,
            render: (message) => (
                <Text type="secondary" ellipsis style={{ maxWidth: '300px' }}>
                    {message.slice(0, 80)}...
                </Text>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'created_on',
            key: 'created_on',
            width: 150,
            sorter: (a, b) => new Date(a.created_on) - new Date(b.created_on),
            render: (date) => {
                const formattedDate = new Date(date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                return (
                    <Space>
                        <CalendarOutlined />
                        {formattedDate}
                    </Space>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => history.push(`/frontend/admin/contact_list/${record.id}`)}
                        size="small"
                        style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                    >
                        View
                    </Button>
                    <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
                        <Button size="small" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
    };

    if (!status) {
        return <Forbidden403 />;
    }

    return (
        <div style={{ padding: '94px 24px 24px 24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Title level={2} style={{ marginBottom: '24px', color: '#1f1f1f' }}>
                Messages Management
            </Title>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                            {stats.total}
                        </div>
                        <div style={{ color: '#8c8c8c' }}>Total Messages</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>
                            {stats.new}
                        </div>
                        <div style={{ color: '#8c8c8c' }}>New</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                            {stats.replied}
                        </div>
                        <div style={{ color: '#8c8c8c' }}>Replied</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8c8c8c' }}>
                            {stats.read}
                        </div>
                        <div style={{ color: '#8c8c8c' }}>Read</div>
                    </div>
                </Card>
            </div>

            {/* Search and Filter Card */}
            <Card style={{ marginBottom: '24px' }}>
                <Space orientation="vertical" style={{ width: '100%' }} size="large">
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <Text strong>Search</Text>
                            <Search
                                placeholder="Search by name, email, or subject..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onSearch={handleSearch}
                                enterButton={<SearchOutlined />}
                                size="large"
                            />
                        </div>

                        <div>
                            <Text strong>Date Range</Text>
                            <RangePicker
                                size="large"
                                value={dateRange}
                                onChange={(dates) => setDateRange(dates || [null, null])}
                                format="DD/MM/YYYY"
                                placeholder={['Date from', 'Date to']}
                            />
                        </div>

                        <div>
                            <Text strong>Status</Text>
                            <Select
                                style={{ width: 150 }}
                                size="large"
                                value={statusFilter}
                                onChange={setStatusFilter}
                            >
                                <Option value="all">All Status</Option>
                                <Option value="new">New</Option>
                                <Option value="read">Read</Option>
                                <Option value="replied">Replied</Option>
                                <Option value="archived">Archived</Option>
                            </Select>
                        </div>

                        <Button
                            size="large"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>

                    {/* Bulk Actions */}
                    {selectedRowKeys.length > 0 && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#e6f7ff',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text strong>{selectedRowKeys.length} message(s) selected</Text>
                            <Space>
                                <Button onClick={() => handleBulkAction('Mark as Read')}>
                                    Mark as Read
                                </Button>
                                <Button danger onClick={() => handleBulkAction('Delete')}>
                                    Delete
                                </Button>
                            </Space>
                        </div>
                    )}
                </Space>
            </Card>

            {/* Messages Table */}
            <Card>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '40px'
                    }}>
                        <Asset spinner />
                    </div>
                ) : (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredMessages}
                        rowKey="id"
                        scroll={{ x: 1200 }}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '15', '25', '50'],
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} messages`,
                            onChange: (page, size) => {
                                setCurrentPage(page);
                                setPageSize(size);
                            },
                        }}
                        rowClassName={(record, index) =>
                            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                        }
                    />
                )}
            </Card>
        </div>
    );
};

export default ContactMessagesList;
