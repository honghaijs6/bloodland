import StyledComponent from "../style-component";
import styled from "styled-components"
import {DataScroller} from "primereact/components/datascroller/DataScroller";

export const StyledDataScroller = styled(StyledComponent(DataScroller))`
    .p-datascroller-inline .p-datascroller-content::-webkit-scrollbar { 
        width: 5px!important; background: #eee; 
    }
   
`;