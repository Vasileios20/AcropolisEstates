import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from '../styles/MortgagePaymentCalculator.module.css';
import btnStyles from '../styles/Button.module.css';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const MortgagePaymentCalculator = ({ price }) => {
    const [principal, setPrincipal] = useState(price);
    const [interestRate, setInterestRate] = useState(3);
    const [loanTerm, setLoanTerm] = useState(25);
    const [monthlyPayment, setMonthlyPayment] = useState(null);
    const [deposit, setDeposit] = useState(price * 0.1);
    const [percentage, setPercentage] = useState(10);
    const principalPercentage = (principal - deposit) / principal * 100;
    const star = "*"
    const { t } = useTranslation();

    const formatValue = (field, value) => {
        const number = parseFloat(String(value).replace(/,/g, ""));
        const amount = parseInt(String(value).replace(/\D/g, ""));

        if (isNaN(number)) return "";

        if (field === "interestRate") {
            return `${value.toString().replace(".", ",")}%`; // Ensure comma for decimals
        }

        if (["principal", "deposit", "monthly", "loanAmount"].includes(field)) {
            return `€${amount.toLocaleString("de-DE")}`; // Uses `de-DE` for correct thousands separator
        }

        return field === "percentage" ? `${number}%` : value;
    };

    const stripCurrency = (value) => Number(String(value).replace(/[^\d.-]/g, ""));

    const calculatePMT = (principal, interestRate, loanTerm) => {
        const r = interestRate / 100 / 12;  // Monthly interest rate
        const n = loanTerm * 12;  // Total number of payments
        const pmt = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return pmt;
    };

    const handlePrincipalChange = (value) => {
        const numericValue = parseInt(value.replace(/\D/g, ""));
        const adjustedPrincipal = Math.min(stripCurrency(numericValue), 1_500_000);
        setPrincipal(adjustedPrincipal);
        setDeposit((adjustedPrincipal * percentage) / 100);
    };

    const handlePercentageChange = (value) => {
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) return;
        setPercentage(numericValue);
        setDeposit((principal * numericValue) / 100);
    };

    // Handle deposit range change, updates deposit value & monthly payment
    const handleDepositRangeChange = (value) => {
        const newDeposit = parseInt(value.replace(/\D/g, ""));
        if (newDeposit < 0 || newDeposit > principal * 0.9) return;
        setDeposit(newDeposit);
        setPercentage(((newDeposit / principal) * 100).toFixed(1)); // Update % based on deposit
    };

    const handleRangeChange = (field, value) => {
        if (field === "principal") {
            handlePrincipalChange(value);
        } else if (field === "deposit") {
            handleDepositRangeChange(value);
        } else if (field === "interestRate") {
            setInterestRate(value);
        } else if (field === "loanTerm") {
            setLoanTerm(value);
        }
    };

    useEffect(() => {
        if (!isNaN(principal) && !isNaN(deposit) && !isNaN(interestRate) && !isNaN(loanTerm)) {
            const loanAmount = principal - deposit;
            setMonthlyPayment(formatValue('monthly', calculatePMT(loanAmount, interestRate, loanTerm).toFixed(0)));
        }
    }, [principal, deposit, interestRate, loanTerm]);

    const renderTooltip = (props) => (
        <Tooltip
            id="button-tooltip"
            {...props}
            className=""
        >
            {t("mortgageCalculator.tooltip")}
        </Tooltip>
    );


    return (
        <Container className='mb-5'>
            <Row className={`${styles.MortgagePaymentCalculator} shadow rounded`}>
                <p className='text-center mb-4 h2'>{t("mortgageCalculator.title")}</p>
                <Col sm={6}>
                    <form>
                        {/* Property Value */}
                        <label>{t("mortgageCalculator.propertyValue")}</label>
                        <input
                            type="text"
                            value={formatValue("principal", principal)}
                            onChange={(e) => handlePrincipalChange(e.target.value)}
                            required
                            className="form-control"
                        />
                        <div className={styles.RangeContainer}>
                            <input
                                type="range"
                                min={10_000}
                                max={1_500_000}
                                step="1000"
                                value={principal}
                                onChange={(e) => handleRangeChange("principal", e.target.value)}
                                className={styles.Range}
                                style={{
                                    background: `linear-gradient(to right, rgba(77, 103, 101, 1) ${(principal / 1_500_000) * 100
                                        }%, #fff ${(principal / 1_500_000) * 100}%)`
                                }}
                            />
                        </div>

                        {/* Deposit Inputs - Side by Side */}
                        <label>{t("mortgageCalculator.deposit")}</label>
                        <div className={styles.DepositContainer}>
                            <input
                                type="text"
                                value={formatValue("deposit", deposit)}
                                onChange={(e) => handleDepositRangeChange(e.target.value)}
                                required
                                className="form-control"
                            />
                            <input
                                type="text"
                                value={formatValue("percentage", Math.round(percentage))}
                                onChange={(e) => handlePercentageChange(stripCurrency(e.target.value))}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className={styles.RangeContainer}>
                            <input
                                type="range"
                                min="0"
                                max={principal * 0.99}
                                step="1000"
                                value={deposit}
                                onChange={(e) => handleRangeChange("deposit", e.target.value)}
                                className={styles.Range}
                                style={{
                                    background: `linear-gradient(to right, rgba(77, 103, 101, 1) ${(deposit / principal * 0.99) * 100
                                        }%, #fff ${(deposit / principal * 0.99) * 100}%)`
                                }}
                            />
                        </div>

                        {/* Interest Rate */}
                        <label>{t("mortgageCalculator.interestRate")}</label>
                        <input
                            type="text"
                            min="0"
                            max="20"
                            step="0.1"
                            value={formatValue("percentage", interestRate)}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            required
                            className="form-control"
                        />
                        <div className={styles.RangeContainer}>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => handleRangeChange("interestRate", Number(e.target.value))}
                                className={styles.Range}
                                style={{
                                    background: `linear-gradient(to right, rgba(77, 103, 101, 1) ${(interestRate / 20) * 100
                                        }%, #fff ${(interestRate / 20) * 100}%)`
                                }}
                            />
                        </div>

                        {/* Loan Term */}
                        <label>{t("mortgageCalculator.loanTerm")} ({t("mortgageCalculator.years")})</label>
                        <input
                            type="number"
                            min="1"
                            max="40"
                            step="1"
                            value={loanTerm}
                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                            required
                            className="form-control"
                        />
                        <div className={styles.RangeContainer}>
                            <input
                                type="range"
                                min="1"
                                max="40"
                                step="1"
                                value={loanTerm}
                                onChange={(e) => handleRangeChange("loanTerm", Number(e.target.value))}
                                className={styles.Range}
                                style={{
                                    background: `linear-gradient(to right, rgba(77, 103, 101, 1) ${(loanTerm / 40) * 100
                                        }%, #fff ${(loanTerm / 40) * 100}%)`
                                }}
                            />
                        </div>
                    </form>
                </Col>

                <Col className="text-center border-start">

                    {/* Circular Mortgage Payment Visualization */}

                    <div className="d-flex justify-content-center">
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 0, hide: 0 }}
                            overlay={renderTooltip}
                            trigger={["hover", "focus"]}
                        >
                            <div className={styles.CircularRange}>
                                <svg width="200" height="200" viewBox="0 0 120 120">
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        stroke="#847c3d"
                                        strokeWidth="6"
                                        fill="none"
                                        opacity="0.1"
                                    />
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        stroke="rgba(77, 103, 101, 1)"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeDasharray="314"
                                        strokeDashoffset={(1 - principalPercentage / 100) * 314}
                                        strokeLinecap="round"
                                        transform="rotate(-90 60 60)"
                                    />
                                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" className={styles.Text}>
                                        {monthlyPayment}/
                                    </text>
                                    <text x="50%" y="50%" textAnchor="middle" dy="1.1em" className={styles.Text}>
                                        {t("mortgageCalculator.month")}
                                    </text>
                                    <text x="71.5%" y="52.5%" textAnchor="middle" dy="1.1em" className={styles.TextStar}>
                                        {star}
                                    </text>
                                </svg>
                            </div>
                        </OverlayTrigger>
                    </div>
                    <div className={`"text-center mt-1" ${styles.TextSize}`}>
                        <p className="m-0">{t("mortgageCalculator.loanAmount")}: {formatValue("loanAmount", (principal - deposit))}</p>
                        <p>{t("mortgageCalculator.deposit")}: {formatValue("deposit", deposit)}</p>
                    </div>
                    <hr></hr>
                    <div className="text-center mb-2">
                        <p>{t("mortgageCalculator.textInterested")}</p>
                        <Link to="/contact" className={`${btnStyles.AngryOcean} ${btnStyles.Button} ${btnStyles.Wide}`}>{t("nav.contact")}</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default MortgagePaymentCalculator;