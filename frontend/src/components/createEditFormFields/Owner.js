import React from "react";
import { Form, Select, Modal } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import OwnerCreateForm from "../../pages/admin/OwnerCreateForm";

const { Option } = Select;

const Owner = ({
    listingData,
    handleChange,
    handleShow,
    handleClose,
    show,
    owners,
    errors,
}) => {
    const handleSelectChange = (value) => {
        handleChange({
            target: {
                name: "listing_owner",
                value: value,
            },
        });
        if (value === "create_new") {
            handleShow();
        }
    };

    return (
        <>
            <Form.Item
                label="Owner"
                validateStatus={errors?.listing_owner ? "error" : ""}
                help={errors?.listing_owner?.[0]}
                required
            >
                <Select
                    value={listingData.listing_owner || undefined}
                    onChange={handleSelectChange}
                    placeholder="Select Owner"
                    suffixIcon={<UserOutlined />}
                    size="large"
                    showSearch
                    filterOption={(input, option) => {
                        // Use the label prop for filtering
                        const label = option?.label || '';
                        return label.toLowerCase().includes(input.toLowerCase());
                    }}
                >
                    <Option value="create_new" label="Create New Owner">
                        <PlusOutlined /> Create New Owner
                    </Option>
                    {owners?.map((owner) => {
                        const ownerName = `${owner.first_name} ${owner.last_name}`;
                        return (
                            <Option
                                key={owner.id}
                                value={owner.id}
                                label={ownerName}
                            >
                                {ownerName}
                            </Option>
                        );
                    })}
                </Select>
            </Form.Item>

            {listingData?.listing_owner === "create_new" && (
                <Modal
                    title="Create New Owner"
                    open={show}
                    onCancel={handleClose}
                    footer={null}
                    centered
                    width={600}
                >
                    <OwnerCreateForm />
                </Modal>
            )}
        </>
    );
};

export default Owner;