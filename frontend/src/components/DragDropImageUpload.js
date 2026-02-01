import React, { useCallback, useState, useEffect } from 'react';
import { Upload, Button, Image, App, Space, Card, Typography, Input, Modal } from 'antd';
import {
    InboxOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    StarFilled,
    ExclamationCircleOutlined
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
const { Text, Title } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

// Sortable Image Item Component - Updated with Description
const SortableImageItem = ({
    id,
    url,
    index,
    onRemove,
    isFirst,
    total,
    onMoveUp,
    onMoveDown,
    description,
    onDescriptionChange,
    isExisting = false,
    imageId = null
}) => {
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
            {isExisting && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: '#1890ff',
                    color: 'white',
                    padding: '4px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    zIndex: 1,
                }}>
                    {t("admin.dragAndDrop.existing") || "Saved"}
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Image
                    src={url}
                    alt={description || `upload-${index}`}
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
                    <div style={{ marginBottom: '8px' }}>
                        <Text strong>{t("admin.dragAndDrop.image")} {index + 1}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {isFirst ? t("admin.dragAndDrop.primaryImage") : t("admin.dragAndDrop.position", { number: index + 1 })}
                        </Text>
                    </div>

                    {/* Description Input */}
                    <div>
                        <label
                            htmlFor={`description-${id}`}
                            style={{
                                display: 'block',
                                marginBottom: '4px',
                                fontSize: '12px',
                                color: '#595959',
                                fontWeight: 500
                            }}
                        >
                            {t("admin.dragAndDrop.imageDescription")} (Alt Text)
                            {isExisting && <span style={{ color: '#1890ff', marginLeft: '4px' }}>✏️ {t("admin.dragAndDrop.editable")}</span>}
                        </label>
                        <TextArea
                            id={`description-${id}`}
                            value={description || ''}
                            onChange={(e) => {
                                e.stopPropagation();
                                onDescriptionChange(id, e.target.value, isExisting, imageId);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={t("admin.dragAndDrop.imageDescriptionPlaceholder")}
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            maxLength={255}
                            showCount
                            style={{ fontSize: '13px' }}
                        />
                    </div>
                </div>
                <Space direction="vertical" size="small">
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
                            onRemove(id, isExisting);
                        }}
                    />
                </Space>
            </div>
        </Card>
    );
};

const DragDropImageUploadAntD = ({
    uploadedImages = [],
    setUploadedImages,
    existingImages = [],
    setExistingImages,
    imagesToDelete = [],
    setImagesToDelete,
    error,
    maxImages = 40,
    listingId = null
}) => {
    const { message } = App.useApp();
    const { t } = useTranslation();
    const [allImages, setAllImages] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Combine existing and new images
    useEffect(() => {
        const combined = [
            ...existingImages.map((img) => ({
                id: `existing-${img.id}`,
                imageId: img.id,
                url: img.url,
                order: img.order,
                description: img.description || '',
                isExisting: true,
            })),
            ...uploadedImages.map((img) => ({
                ...img,
                isExisting: false,
            }))
        ].sort((a, b) => a.order - b.order);

        setAllImages(combined);
    }, [existingImages, uploadedImages]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = allImages.findIndex((img) => img.id === active.id);
            const newIndex = allImages.findIndex((img) => img.id === over.id);
            const newArray = arrayMove(allImages, oldIndex, newIndex);

            const reordered = newArray.map((img, index) => ({
                ...img,
                order: index,
            }));

            updateSeparateLists(reordered);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allImages]);

    const updateSeparateLists = (reordered) => {
        const existingReordered = reordered.filter(img => img.isExisting).map(img => ({
            id: img.imageId,
            url: img.url,
            order: img.order,
            description: img.description,
            is_first: img.order === 0,
        }));

        const newReordered = reordered.filter(img => !img.isExisting);

        setExistingImages(existingReordered);
        setUploadedImages(newReordered);
    };

    const customRequest = useCallback(({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    }, []);

    const beforeUpload = useCallback((file, fileList) => {
        const totalImages = existingImages.length + uploadedImages.length;
        const remainingSlots = maxImages - totalImages;
        const currentIndex = fileList.indexOf(file);

        if (currentIndex >= remainingSlots) {
            if (currentIndex === 0) {
                message.error(t("admin.dragAndDrop.maxImagesError", { maxImages }));
            }
            return Upload.LIST_IGNORE;
        }

        const newImage = {
            id: `new-${Date.now()}-${Math.random()}-${currentIndex}`,
            file: file,
            order: totalImages + currentIndex,
            url: URL.createObjectURL(file),
            description: '',
            isExisting: false,
        };

        setUploadedImages(prev => {
            const isLastFile = currentIndex === Math.min(fileList.length, remainingSlots) - 1;
            const newImages = [...prev, newImage];

            if (isLastFile) {
                const addedCount = Math.min(fileList.length, remainingSlots);
                setTimeout(() => {
                    message.success(t("admin.dragAndDrop.imagesUploadedSuccess", { count: addedCount }));
                }, 100);
            }

            return newImages;
        });

        return false;
    }, [existingImages.length, uploadedImages, maxImages, message, setUploadedImages, t]);

    const handleRemove = useCallback((id, isExisting) => {
        if (isExisting) {
            confirm({
                title: t("admin.dragAndDrop.deleteConfirmTitle"),
                icon: <ExclamationCircleOutlined />,
                content: t("admin.dragAndDrop.deleteConfirmMessage"),
                okText: t("admin.dragAndDrop.delete"),
                okType: 'danger',
                cancelText: t("admin.dragAndDrop.cancel"),
                onOk() {
                    const imageId = parseInt(id.replace('existing-', ''));
                    setImagesToDelete([...imagesToDelete, imageId]);
                    setExistingImages(existingImages.filter(img => img.id !== imageId));
                    message.success(t("admin.dragAndDrop.imageRemoved"));
                },
            });
        } else {
            setUploadedImages(prev => {
                const index = prev.findIndex(img => img.id === id);
                if (index !== -1) {
                    URL.revokeObjectURL(prev[index].url);
                    const newImages = [...prev];
                    newImages.splice(index, 1);
                    newImages.forEach((img, idx) => (img.order = existingImages.length + idx));
                    message.success(t("admin.dragAndDrop.imageRemoved"));
                    return newImages;
                }
                return prev;
            });
        }
    }, [existingImages, imagesToDelete, message, setExistingImages, setImagesToDelete, setUploadedImages, t]);

    const handleMoveUp = useCallback((index) => {
        if (index === 0) return;
        const newArray = [...allImages];
        [newArray[index - 1], newArray[index]] = [newArray[index], newArray[index - 1]];
        const reordered = newArray.map((img, idx) => ({
            ...img,
            order: idx,
        }));
        updateSeparateLists(reordered);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allImages]);

    const handleMoveDown = useCallback((index) => {
        if (index === allImages.length - 1) return;
        const newArray = [...allImages];
        [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
        const reordered = newArray.map((img, idx) => ({
            ...img,
            order: idx,
        }));
        updateSeparateLists(reordered);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allImages]);

    const handleDescriptionChange = useCallback((id, description, isExisting, imageId) => {
        if (isExisting && imageId) {
            const updatedExisting = existingImages.map(img =>
                img.id === imageId ? { ...img, description } : img
            );
            setExistingImages(updatedExisting);
        } else {
            const updated = uploadedImages.map(img =>
                img.id === id ? { ...img, description } : img
            );
            setUploadedImages(updated);
        }
    }, [existingImages, uploadedImages, setExistingImages, setUploadedImages]);

    const totalImages = existingImages.length + uploadedImages.length;

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
                disabled={totalImages >= maxImages}
                style={{
                    marginBottom: allImages.length > 0 ? '24px' : 0,
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: '#847c3d', fontSize: '48px' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
                    {t("admin.dragAndDrop.clickOrDragImages")}
                </p>
                <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                    {totalImages > 0
                        ? `${totalImages} ${t("admin.dragAndDrop.of")} ${maxImages} ${t("admin.dragAndDrop.imagesUploaded")}. ${t("admin.dragAndDrop.firstImagePrimary")}`
                        : `${t("admin.dragAndDrop.uploadLimit", { maxImages: maxImages })} ${t("admin.dragAndDrop.images")}. ${t("admin.dragAndDrop.firstImagePrimary")}`
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

            {/* All Images - Unified List */}
            {allImages.length > 0 && (
                <div>
                    <Title level={5} style={{ marginBottom: '12px' }}>
                        {t("admin.dragAndDrop.allImages")} ({allImages.length})
                    </Title>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={allImages.map((img) => img.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {allImages.map((img, index) => (
                                <SortableImageItem
                                    key={img.id}
                                    id={img.id}
                                    url={img.url}
                                    index={index}
                                    onRemove={handleRemove}
                                    isFirst={index === 0}
                                    total={allImages.length}
                                    onMoveUp={handleMoveUp}
                                    onMoveDown={handleMoveDown}
                                    description={img.description}
                                    onDescriptionChange={handleDescriptionChange}
                                    isExisting={img.isExisting}
                                    imageId={img.imageId}
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