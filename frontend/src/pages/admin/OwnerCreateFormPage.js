import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import OwnerCreateForm from './OwnerCreateForm';

const OwnerCreateFormPage = () => {
    return (
        <Container className="mt-5 mb-3 pt-5">
            <Row className="col-6 mx-auto">
                <OwnerCreateForm />
            </Row>
        </Container>
    );
};

export default OwnerCreateFormPage;
