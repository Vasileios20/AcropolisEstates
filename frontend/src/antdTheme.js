// antdTheme.js
// Custom Ant Design theme configuration to match Acropolis Estates brand

export const acropolisTheme = {
  token: {
    // Primary brand color (Gold from logo)
    colorPrimary: '#4d6765',
    
    // Border radius
    borderRadius: 8,
    
    // Font family
    fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    
    // Font sizes
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // Colors
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    
    // Link colors
    colorLink: '#4d6765',
    colorLinkHover: '#6b6331',
    colorLinkActive: '#6b6331',
    
    // Background colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgElevated: '#ffffff',
    
    // Text colors
    colorText: '#1f1f1f',
    colorTextSecondary: '#8c8c8c',
    colorTextDisabled: '#bfbfbf',
    
    // Border
    colorBorder: '#d9d9d9',
    
    // Box shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.12)',
  },
  
  components: {
    // Button
    Button: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 500,
      primaryColor: '#ffffff',
      defaultBorderColor: '#d9d9d9',
      defaultColor: '#1f1f1f',
      dangerColor: '#ff4d4f',
      algorithm: true,
    },
    
    // Table
    Table: {
      headerBg: '#fafafa',
      headerColor: '#1f1f1f',
      rowHoverBg: '#f5f5f5',
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
      borderColor: '#f0f0f0',
      headerSplitColor: '#f0f0f0',
      algorithm: true,
    },
    
    // Card
    Card: {
      headerBg: 'transparent',
      headerFontSize: 18,
      headerFontWeight: 600,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      borderRadiusLG: 12,
      paddingLG: 24,
      algorithm: true,
    },
    
    // Input
    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
      paddingBlock: 8,
      paddingInline: 12,
      borderRadius: 8,
      colorBorder: '#d9d9d9',
      activeBorderColor: '#4d6765',
      hoverBorderColor: '#4d6765',
      algorithm: true,
    },
    
    // Select
    Select: {
      controlHeight: 40,
      controlHeightLG: 48,
      borderRadius: 8,
      colorBorder: '#d9d9d9',
      algorithm: true,
    },
    
    // Tag
    Tag: {
      defaultBg: '#fafafa',
      defaultColor: '#595959',
      borderRadiusSM: 4,
      fontSizeSM: 12,
      algorithm: true,
    },
    
    // Modal
    Modal: {
      headerBg: '#ffffff',
      borderRadiusLG: 12,
      paddingLG: 24,
      algorithm: true,
    },
    
    // Message/Notification
    Message: {
      contentBg: '#ffffff',
      borderRadiusLG: 8,
      algorithm: true,
    },
    
    // Steps
    Steps: {
      colorPrimary: '#4d6765',
      dotSize: 32,
      algorithm: true,
    },
    
    // Upload
    Upload: {
      colorPrimary: '#4d6765',
      colorPrimaryHover: '#6b6331',
      algorithm: true,
    },
  },
};

// CSS overrides for additional customization
export const customStyles = `
  /* Global styles */
  .ant-btn-primary {
    background-color: #4d6765 !important;
    border-color: #4d6765 !important;
  }
  
  .ant-btn-primary:hover,
  .ant-btn-primary:focus {
    background-color: #6b6331 !important;
    border-color: #6b6331 !important;
  }
  
  /* Table row hover effect */
  .ant-table-tbody > tr:hover > td {
    background-color: #f5f5f5 !important;
  }
  
  /* Card hover effect for dashboard cards */
  .ant-card-hoverable:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  /* Stats value colors */
  .ant-statistic-content-value {
    font-weight: 600;
  }
  
  /* Tag improvements */
  .ant-tag {
    font-weight: 500;
    padding: 4px 12px;
  }
  
  /* Upload dragger improvements */
  .ant-upload-drag {
    border: 2px dashed #d9d9d9 !important;
    border-radius: 8px !important;
    background-color: #fafafa !important;
  }
  
  .ant-upload-drag:hover {
    border-color: #4d6765 !important;
    background-color: #f5f5f5 !important;
  }
  
  /* Search input focus */
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border-color: #4d6765 !important;
    box-shadow: 0 0 0 2px rgba(132, 124, 61, 0.1) !important;
  }
  
  /* Active menu item */
  .ant-menu-item-selected {
    background-color: rgba(132, 124, 61, 0.1) !important;
    color: #4d6765 !important;
  }
  
  /* Link styling */
  a {
    color: #4d6765;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  a:hover {
    color: #6b6331;
  }
  
  /* Loading spinner */
  .ant-spin-dot-item {
    background-color: #4d6765 !important;
  }
  
  /* Scrollbar styling for better UX */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  /* Responsive padding adjustments */
  @media (max-width: 768px) {
    .ant-card {
      margin-bottom: 16px;
    }
    
    .ant-statistic-title {
      font-size: 12px;
    }
    
    .ant-statistic-content-value {
      font-size: 24px;
    }
  }
  
  /* Status icons in tables */
  .anticon {
    transition: all 0.3s ease;
  }
  
  .anticon:hover {
    transform: scale(1.1);
  }
`;
