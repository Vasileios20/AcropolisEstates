import React, { useCallback } from 'react';
import { Upload, Button, Image, App, Space, Card, Typography } from 'antd';
import {
    InboxOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    StarFilled
} from '@ant-design/icons';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';

const { Dragger } = Upload;
const { Text } = Typography;

// Sortable Image Item Component
const SortableImageItem = ({ id, url, index, onRemove, isFirst, total, onMoveUp, onMoveDown }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const { t } = useTranslation();

    return (
        <Card
            ref={setNodeRef}
            style={{
                ...style,
                marginBottom: '12px',
                cursor: 'move',
                border: isFirst ? '2px solid #faad14' : '1px solid #d9d9d9',
                position: 'relative',
            }}
            {...attributes}
            {...listeners}
            styles={{ body: { padding: '12px' } }}
        >
            {isFirst && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#faad14',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 1,
                }}>
                    <StarFilled /> {t("admin.dragAndDrop.primary")}
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Image
                    src={url}
                    alt={`upload-${index}`}
                    width={80}
                    height={80}
                    style={{
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                    }}
                    preview={{
                        cover: <div style={{ fontSize: '12px' }}>{t("admin.dragAndDrop.preview")}</div>
                    }}
                />
                <div style={{ flex: 1 }}>
                    <Text strong>{t("admin.dragAndDrop.image")} {index + 1}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {isFirst ? t("admin.dragAndDrop.primaryImage") : t("admin.dragAndDrop.position", { number: index + 1 })}
                    </Text>
                </div>
                <Space orientation="vertical" size="small">
                    {index > 0 && (
                        <Button
                            size="small"
                            icon={<ArrowUpOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveUp(index);
                            }}
                        />
                    )}
                    {index < total - 1 && (
                        <Button
                            size="small"
                            icon={<ArrowDownOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onMoveDown(index);
                            }}
                        />
                    )}
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(index);
                        }}
                    />
                </Space>
            </div>
        </Card>
    );
};

const DragDropImageUploadAntD = ({
    uploadedImages,
    setUploadedImages,
    error,
    maxImages = 40,
}) => {
    const { message } = App.useApp();
    const { t } = useTranslation();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setUploadedImages((prevImages) => {
                const oldIndex = prevImages.findIndex((img) => img.id === active.id);
                const newIndex = prevImages.findIndex((img) => img.id === over.id);

                const newImages = arrayMove(prevImages, oldIndex, newIndex);
                newImages.forEach((img, idx) => (img.order = idx));
                return newImages;
            });
        }
    }, [setUploadedImages]);

    // Custom request to handle multiple files properly
    const customRequest = useCallback(({ file, onSuccess }) => {
        // Just mark as done immediately since we handle it in beforeUpload
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    }, []);

    const beforeUpload = useCallback((file, fileList) => {
        // Calculate how many files we can accept
        const remainingSlots = maxImages - uploadedImages.length;

        // Get the index of current file in the fileList
        const currentIndex = fileList.indexOf(file);

        // Only process if this is within our limit
        if (currentIndex >= remainingSlots) {
            if (currentIndex === 0) {
                message.error(`Maximum ${maxImages} images allowed`);
            }
            return Upload.LIST_IGNORE; // Ignore files beyond limit
        }

        // Create image object for this file
        const newImage = {
            id: `${Date.now()}-${Math.random()}-${currentIndex}`,
            file: file,
            order: uploadedImages.length + currentIndex,
            url: URL.createObjectURL(file),
        };

        // Add to state
        setUploadedImages(prev => {
            // Check if we're processing the last file in the batch
            const isLastFile = currentIndex === Math.min(fileList.length, remainingSlots) - 1;
            const newImages = [...prev, newImage];

            // Show success message only for the last file
            if (isLastFile) {
                const addedCount = Math.min(fileList.length, remainingSlots);
                setTimeout(() => {
                    message.success(`${addedCount} image${addedCount > 1 ? 's' : ''} uploaded`);
                }, 100);
            }

            return newImages;
        });

        return false; // Prevent default upload
    }, [uploadedImages.length, maxImages, message, setUploadedImages]);

    const handleRemove = useCallback((index) => {
        setUploadedImages(prev => {
            const newImages = [...prev];
            // Revoke the object URL to prevent memory leaks
            URL.revokeObjectURL(newImages[index].url);
            newImages.splice(index, 1);
            newImages.forEach((img, idx) => (img.order = idx));
            message.success('Image removed');
            return newImages;
        });
    }, [message, setUploadedImages]);

    const handleMoveUp = useCallback((index) => {
        if (index === 0) return;
        setUploadedImages(prev => {
            const newImages = arrayMove(prev, index, index - 1);
            newImages.forEach((img, idx) => (img.order = idx));
            return newImages;
        });
    }, [setUploadedImages]);

    const handleMoveDown = useCallback((index) => {
        setUploadedImages(prev => {
            if (index === prev.length - 1) return prev;
            const newImages = arrayMove(prev, index, index + 1);
            newImages.forEach((img, idx) => (img.order = idx));
            return newImages;
        });
    }, [setUploadedImages]);

    return (
        <div style={{ marginBottom: '24px' }}>
            {/* Upload Area */}
            <Dragger
                name="file"
                multiple
                accept="image/*"
                beforeUpload={beforeUpload}
                customRequest={customRequest}
                showUploadList={false}
                disabled={uploadedImages.length >= maxImages}
                style={{
                    marginBottom: uploadedImages.length > 0 ? '24px' : 0,
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: '#847c3d', fontSize: '48px' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                    {t("admin.dragAndDrop.clickOrDragImages")}
                </p>
                <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                    {uploadedImages.length > 0
                        ? `${uploadedImages.length} of ${maxImages} ${t("admin.dragAndDrop.imagesUploaded")}. ${t("admin.dragAndDrop.firstImagePrimary")}`
                        : `${t("admin.dragAndDrop.uploadLimit", { maxImages: maxImages })} ${t("admin.dragAndDrop.images")}.${t("admin.dragAndDrop.firstImagePrimary")}`
                    }
                </p>
            </Dragger>

            {/* Error Messages */}
            {error && Array.isArray(error) && error.map((msg, idx) => (
                <div key={idx} style={{
                    color: '#ff4d4f',
                    backgroundColor: '#fff2f0',
                    border: '1px solid #ffccc7',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: '12px',
                }}>
                    {msg}
                </div>
            ))}

            {/* Sortable Image List */}
            {uploadedImages.length > 0 && (
                <div>
                    <Text strong style={{ marginBottom: '12px', display: 'block' }}>
                        {t("admin.dragAndDrop.uploadedImages")}:
                    </Text>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={uploadedImages.map((img) => img.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {uploadedImages.map((img, index) => (
                                <SortableImageItem
                                    key={img.id}
                                    id={img.id}
                                    url={img.url}
                                    index={index}
                                    onRemove={handleRemove}
                                    isFirst={index === 0}
                                    total={uploadedImages.length}
                                    onMoveUp={handleMoveUp}
                                    onMoveDown={handleMoveDown}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    );
};

export default DragDropImageUploadAntD;