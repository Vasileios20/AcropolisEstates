import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
    Card,
    Descriptions,
    Button,
    Space,
    Typography,
    Tag,
    Select,
    Modal
} from 'antd';
import {
    ArrowLeftOutlined,
    MailOutlined,
    UserOutlined,
    CalendarOutlined,
    MessageOutlined,
    DeleteOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import Asset from "../../components/Asset";
import { App } from 'antd';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const ContactMessageEnhanced = () => {
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const { id } = useParams();
    const { message: antMessage } = App.useApp();

    const fetchMessage = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axiosReq.get(`/contact_list/${id}/`);
            setMessage({
                ...data,
                status: data.status || 'new'
            });
        } catch (err) {
            console.error('Error fetching message:', err);
            if (err.response?.status === 403) {
                history.push("/forbidden");
            }
        } finally {
            setLoading(false);
        }
    }, [id, history]);

    useEffect(() => {
        fetchMessage();
    }, [fetchMessage]);

    const handleStatusChange = async (newStatus) => {
        try {
            // Update status on backend (you'll need to implement this endpoint)
            // await axiosReq.patch(`/contact_list/${id}/`, { status: newStatus });

            setMessage({ ...message, status: newStatus });
            antMessage.success(`Status changed to ${newStatus}`);
        } catch (err) {
            antMessage.error('Failed to update status');
        }
    };

    const handleDelete = () => {
        confirm({
            title: 'Delete Message',
            content: 'Are you sure you want to delete this message? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axiosReq.delete(`/contact_list/${id}/`);
                    antMessage.success('Message deleted');
                    history.push('/contact_list');
                } catch (err) {
                    antMessage.error('Failed to delete message');
                }
            },
        });
    };

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

    if (loading) {
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

    if (!message) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Title level={3}>Message not found</Title>
                <Button
                    type="primary"
                    onClick={() => history.push('/contact_list')}
                    style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                >
                    Back to Messages
                </Button>
            </div>
        );
    }

    const formattedDate = new Date(message.created_on).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div style={{
            padding: '94px 24px 24px 24px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Action Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => history.push('/frontend/admin/contact_list')}
                        size="large"
                    >
                        Back to Messages
                    </Button>

                    <Space>
                        <Select
                            value={message.status}
                            onChange={handleStatusChange}
                            style={{ width: 150 }}
                            size="large"
                        >
                            <Option value="new">New</Option>
                            <Option value="read">Read</Option>
                            <Option value="replied">Replied</Option>
                            <Option value="archived">Archived</Option>
                        </Select>

                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                            size="large"
                        >
                            Delete
                        </Button>
                    </Space>
                </div>

                {/* Message Card */}
                <Card>
                    {/* Header */}
                    <div style={{
                        borderBottom: '2px solid #f0f0f0',
                        paddingBottom: '16px',
                        marginBottom: '24px'
                    }}>
                        <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={3} style={{ margin: 0 }}>
                                    Message from {message.first_name} {message.last_name}
                                </Title>
                                {getStatusTag(message.status)}
                            </div>
                            <Space>
                                <Tag icon={<CalendarOutlined />} color="blue">
                                    {formattedDate}
                                </Tag>
                            </Space>
                        </Space>
                    </div>

                    {/* Contact Information */}
                    <Descriptions
                        column={1}
                        bordered
                        style={{ marginBottom: '24px' }}
                        styles={{
                            fontWeight: 600,
                            backgroundColor: '#fafafa',
                            width: '150px'
                        }}
                    >
                        <Descriptions.Item
                            label={
                                <Space>
                                    <UserOutlined />
                                    Name
                                </Space>
                            }
                        >
                            {message.first_name} {message.last_name}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <Space>
                                    <MailOutlined />
                                    Email
                                </Space>
                            }
                        >
                            <a href={`mailto:${message.email}`}>{message.email}</a>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <Space>
                                    <MessageOutlined />
                                    Subject
                                </Space>
                            }
                        >
                            <strong>{message.subject}</strong>
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Message Content */}
                    <div style={{
                        backgroundColor: '#fafafa',
                        padding: '24px',
                        borderRadius: '8px',
                        marginBottom: '24px'
                    }}>
                        <Title level={5} style={{ marginBottom: '12px' }}>
                            Message:
                        </Title>
                        <Paragraph style={{
                            fontSize: '15px',
                            lineHeight: '1.8',
                            whiteSpace: 'pre-wrap',
                            marginBottom: 0
                        }}>
                            {message.message}
                        </Paragraph>
                    </div>

                    {/* Quick Actions */}
                    <Space size="large">
                        <Button
                            type="primary"
                            icon={<MailOutlined />}
                            size="large"
                            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                            style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                            onClick={() => handleStatusChange('replied')}
                        >
                            Reply via Email
                        </Button>

                        {message.status === 'new' && (
                            <Button
                                icon={<CheckCircleOutlined />}
                                size="large"
                                onClick={() => handleStatusChange('read')}
                            >
                                Mark as Read
                            </Button>
                        )}

                        <Button
                            size="large"
                            onClick={() => history.push('/frontend/admin/contact_list')}
                        >
                            Back to List
                        </Button>
                    </Space>
                </Card>
            </div>
        </div>
    );
};

export default ContactMessageEnhanced;
