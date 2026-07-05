import { useContext } from "react";
import { WorkflowContext } from "../context/WorkflowContextCore";

export const useWorkflow = () => useContext(WorkflowContext);