import StyledComponent from '../style-component'
import styled from "styled-components";
import {Dropdown} from "primereact/dropdown";

export const StyledDropdown = styled(StyledComponent(Dropdown))`
    .p-dropdown {
        width: auto !important;
        height: auto !important;
        border-radius: 63px !important;
        border: none;
    }
    .p-dropdown .p-dropdown-trigger{
        border-radius: 10px;
        width: 33px;
        background: #EFEEEE;
    }
    .p-dropdown-trigger .p-dropdown-trigger-icon{
        position: unset !important;
        margin: unset !important;
        width: 0.7rem;
        height: 0.7rem;
        background: url("/images/bloodland-ui/dropdown-btn-bg.svg") no-repeat center;
    }
    .p-dropdown-trigger .p-dropdown-trigger-icon:before {
        content: none;
        
    }
    .p-inputtext {
        border-radius: 6px;
        padding-left: 10px;
        font-size: 11px;
        width: 160px !important;
        color: black;
        background: #EFEEEE
    }
     .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight{
        background: #AC0000 !important;
     }
`;