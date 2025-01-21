import React, { useState, useEffect } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useHistory, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import styles from '../../styles/Admin.module.css';
import btnStyles from '../../styles/Button.module.css';

const OwnerEditForm = () => {
    const { id } = useParams(); // Get owner ID from the URL
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        phone_2: '',
        notes: '',
    });
    const [files, setFiles] = useState([]); // State for uploaded files
    const history = useHistory();

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const { data } = await axiosReq.get(`/listings/owners/${id}/`);
                setFormData({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    phone: data.phone,
                    phone_2: data.phone_2 || '',
                    notes: data.notes || '',
                });
                setFiles(data.files || []); // Preload existing files
            } catch (error) {
                console.error('Error fetching owner data:', error);
            }
        };

        fetchOwnerData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const handleFileRemove = (index) => {
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

        // Append files
        files.forEach((file) => {
            if (file instanceof File) {
                data.append('files', file);
            }
        });

        try {
            await axiosReq.put(`/listings/owners/${id}/`, data);
            history.push(`/frontend/admin/listings/owners/${id}`);
        } catch (error) {
            console.error('Error updating owner:', error.response?.data || error.message);
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <Row>
                <Form onSubmit={handleSubmit} className="col-6 mx-auto border shadow p-4 rounded">
                    <p className="text-center h3">Edit Owner</p>
                    <Form.Group controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPhone2">
                        <Form.Label>Phone 2</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone_2"
                            value={formData.phone_2}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="notes"
                            value={formData.notes}
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
                                    <span>Click to select files or drag and drop here</span>
                                </div>
                            </div>
                        </Form.Label>
                        {files.length > 0 && (
                            <ListGroup className={styles.FileList}>
                                {files.map((file, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                        {file.name || file.file_url} {/* Handle existing and new files */}
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleFileRemove(index)}
                                        >
                                            Remove
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Form.Group>
                    <Button type="submit" className={`${btnStyles.AngryOcean} ${btnStyles.Button} mt-3`}>
                        Update Owner
                    </Button>
                </Form>
            </Row>
        </Container>
    );
};

export default OwnerEditForm;
