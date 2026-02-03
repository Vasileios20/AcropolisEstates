import React, { useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from '../../styles/Admin.module.css';
import btnStyles from '../../styles/Button.module.css';
import { useTranslation } from 'react-i18next';

const OwnerCreateForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        phone_2: '',
    });
    const [files, setFiles] = useState([]); // State for multiple files
    const history = useHistory();
    const { t } = useTranslation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        // Convert FileList to an array and add it to the existing files
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleFileRemove = (index) => {
        // Remove a file at the given index
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles([...files, ...droppedFiles]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Append text fields
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        // Append files individually
        files.forEach((file) => {
            data.append('files', file);
        });

        try {
            const response = await axiosReq.post('/listings/owners/', data);
            history.location.pathname === '/frontend/admin/listings/owners/create' ? history.push(`/frontend/admin/listings/owners/${response.data.id}`) : history.go(0);;
        } catch (error) {
            console.error('Error adding owner:', error.response?.data || error.message);
        }
    };

    return (

        <Form onSubmit={handleSubmit} className="mx-auto border shadow p-4 rounded">
            <p className="text-center h3">{t("admin.owner.addOwner")}</p>
            <Form.Group controlId="formFirstName">
                <Form.Label>{t("admin.owner.firstName")}</Form.Label>
                <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formLastName">
                <Form.Label>{t("admin.owner.lastName")}</Form.Label>
                <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formEmail">
                <Form.Label>{t("admin.owner.email")}</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formPhone">
                <Form.Label>{t("admin.owner.phone")}</Form.Label>
                <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formPhone2">
                <Form.Label>{t("admin.owner.phone2")}</Form.Label>
                <Form.Control
                    type="text"
                    name="phone_2"
                    value={formData.phone_2}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group controlId="formNotes">
                <Form.Label>{t("admin.owner.notes")}</Form.Label>
                <Form.Control
                    as="textarea"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={3}
                />
            </Form.Group>

            <Form.Group controlId="formFileUpload" className="mt-3">
                <Form.Label>
                    <div className={styles.FileUploadContainer}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <Form.Control
                            type="file"
                            name="files"
                            onChange={handleFileChange}
                            multiple
                            className={styles.FileInput}
                        />
                        <div className={styles.FileUploadLabel}>
                            <span>{t("admin.owner.fileUploadInstructions")}</span>
                        </div>
                    </div>
                </Form.Label>
                {files.length > 0 && (
                    <ListGroup className={styles.FileList}>
                        {files.map((file, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                {file.name}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleFileRemove(index)}
                                >
                                    {t("admin.owner.remove")}
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Form.Group>
            <Button type="submit" className={`${btnStyles.AngryOcean} ${btnStyles.Button}`}>
                {t("admin.owner.addOwner")}
            </Button>
        </Form>

    );
};

export default OwnerCreateForm;
