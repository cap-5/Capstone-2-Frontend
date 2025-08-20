import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../shared";

// ---- CSS MUI IMPORTS BELOW HERE ---- \\
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Container,
  Tooltip,
  Skeleton,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  TableSortLabel,
} from "@mui/material";

import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---- CSS MUI IMPORTS ABOVE HERE ---- \\

// ----------------- Helpers -----------------
function TabPanel({ value, index, children, ...other }) {
  return (
    <div hidden={value !== index} role="tabpanel" {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const fmtCurrency = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
    : "$0.00";

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "—");

// -------------------------------------------

function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(0);
  const [members, setMembers] = useState([]);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [receipts, setReceipts] = useState([]);
  
  // Loading and Leaving Notifications
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingReceipts, setLoadingReceipts] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [err, setErr] = useState("");

  // Sort/pagination state for receipts
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch group members
  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await axios.get(`${API_URL}/api/group/${id}/members`, {
        withCredentials: true,
      });
      setMembers(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.error || "Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch receipts
  const fetchReceipts = async () => {
    try {
      setLoadingReceipts(true);
      const res = await axios.get(`${API_URL}/api/group/GroupReceipts/${id}`);
      setReceipts(res.data || []);
    } catch (e) {
      console.error("Error fetching receipts", e);
    } finally {
      setLoadingReceipts(false);
    }
  };

  // Fetch group name
  const fetchGroupName = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/group/myGroups/${id}`);
      setGroupName(res.data.groupName || "Unnamed Group");
    } catch (e) {
      console.error("Failed to fetch group name", e);
    }
  };

  // Remove a member function 
  const confirmRemoveMember = async () => {
  if (!memberToRemove) return;

  // This removes with toast notifcations. 
  const userId = memberToRemove.id;
  const name =
    memberToRemove.username ||
    [memberToRemove.firstName, memberToRemove.lastName].filter(Boolean).join(" ") ||
    memberToRemove.email ||
    "this member";

  try {
    await axios.delete(`${API_URL}/api/group/${id}/members/${userId}`, {
      withCredentials: true,
    });
    setMembers((prev) => prev.filter((m) => m.id !== userId));
    toast.success(`${name} was removed from the group`);
  } catch (e) {
    toast.error(e?.response?.data?.error || "Failed to remove member");
  } finally {
    setRemoveOpen(false);
    setMemberToRemove(null);
  }
};

  // Leave group (Make sure to add toast notifications for other ones)
  const handleLeave = async () => {
    try {
      setLeaving(true);
      await axios.post(`${API_URL}/api/group/${id}/leave`, {}, { withCredentials: true });
      toast.success("You left the group");
      navigate("/group");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Failed to leave group");
    } finally {
      setLeaving(false);
      setLeaveOpen(false);
    }
  };

    // Handlers here below
    const openRemoveDialog = (member) => {
      setMemberToRemove(member);
      setRemoveOpen(true);
    };

  useEffect(() => {
    fetchMembers();
    fetchReceipts();
    fetchGroupName();
  }, [id]);

  const handleTabChange = (_, newValue) => setTabIndex(newValue);

  // Sorting + pagination for receipts. Adjusting later down the road but keeping short for now
  const sortedReceipts = useMemo(() => {
    const data = [...receipts];
    data.sort((a, b) => {
      const av = a[orderBy] ?? "";
      const bv = b[orderBy] ?? "";
      const cmp = av > bv ? 1 : av < bv ? -1 : 0;
      return order === "asc" ? cmp : -cmp;
    });
    return data;
  }, [receipts, orderBy, order]);

  const pagedReceipts = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedReceipts.slice(start, start + rowsPerPage);
  }, [sortedReceipts, page, rowsPerPage]);

  // ====== ALL CSS WITH INTERACTABLE BUTTONS BELOW HERE ===== \\
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* === Breadcrumbs  === */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/group")}
          sx={{ cursor: "pointer" }}
        >
          My Groups
        </Link>
        <Typography color="text.primary">{groupName || "…"}</Typography>
      </Breadcrumbs>

      {/* === Header card === */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          position: "sticky",
          top: 16,
          zIndex: (t) => t.zIndex.appBar - 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <GroupIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ lineHeight: 1 }}>
                {groupName || <Skeleton width={180} />}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {loadingMembers ? (
                  <Skeleton width={120} />
                ) : (
                  `${members.length} member${members.length === 1 ? "" : "s"}`
                )}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              startIcon={<DocumentScannerIcon />}
              variant="outlined"
              onClick={() => navigate(`/upload/${id}`)}
            >
              Scan receipt
            </Button>
            <Button
              startIcon={<PersonAddAltIcon />}
              variant="contained"
              onClick={() => navigate(`/group/${id}/user-search`)}
            >
              Add members
            </Button>
            <Tooltip title="Leave this group">
              <span>
                <Button
                  startIcon={<LogoutIcon />}
                  variant="text"
                  color="error"
                  onClick={() => setLeaveOpen(true)}
                  disabled={leaving}
                >
                  {leaving ? "Leaving…" : "Leave"}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Box>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{ mt: 2 }}
          textColor="primary"
          indicatorColor="primary"
          aria-label="Group Tabs"
        >
          <Tab icon={<GroupIcon fontSize="small" />} iconPosition="start" label="Members" />
          <Tab icon={<ReceiptLongIcon fontSize="small" />} iconPosition="start" label="Receipts" />
        </Tabs>
      </Paper>

      {/* ===== Members Tab ===== */}
      <TabPanel value={tabIndex} index={0}>
        {loadingMembers ? (
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", py: 1.5, gap: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="30%" />
                  <Skeleton width="50%" />
                </Box>
              </Box>
            ))}
          </Paper>
        ) : err ? (
          <Typography color="error">{err}</Typography>
        ) : members.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <Avatar sx={{ mx: "auto", mb: 2 }}>
              <PersonAddAltIcon />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              No members yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add teammates to start scanning and assigning receipts together.
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddAltIcon />}
              onClick={() => navigate(`/group/${id}/user-search`)}
            >
              Add members
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <List disablePadding>
              {members.map((m, idx) => (
                <React.Fragment key={m.id}>
                  <ListItem
                    secondaryAction={
                      <Tooltip title="Remove member">
                        <IconButton edge="end" onClick={() => openRemoveDialog(m)}>
                          <PersonRemoveIcon />
                        </IconButton>
                      </Tooltip>
                    }
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={m.profilePic || undefined}>
                        {m.username?.[0]?.toUpperCase() || "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 500 }}>{m.username}</Typography>}
                      secondary={m.email}
                    />
                  </ListItem>
                  {idx < members.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </TabPanel>

      {/* ===== Receipts ===== */}
      <TabPanel value={tabIndex} index={1}>
        {loadingReceipts ? (
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={48} sx={{ mb: 1 }} />
            ))}
          </Paper>
        ) : receipts.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <Avatar sx={{ mx: "auto", mb: 2 }}>
              <ReceiptLongIcon />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              No receipts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Scan a receipt to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<DocumentScannerIcon />}
              onClick={() => navigate(`/upload/${id}`)}
            >
              Scan receipt
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: 3 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      { id: "title", label: "Title", align: "left" },
                      { id: "body", label: "Body", align: "left" },
                      { id: "category", label: "Category", align: "left" },
                      { id: "totalPay", label: "Total", align: "right" },
                      { id: "createdAt", label: "Created", align: "right" },
                    ].map((col) => (
                      <TableCell key={col.id} align={col.align} sx={{ fontWeight: 700 }}>
                        <TableSortLabel
                          active={orderBy === col.id}
                          direction={orderBy === col.id ? order : "asc"}
                          onClick={() => {
                            setOrderBy(col.id);
                            setOrder(orderBy === col.id && order === "asc" ? "desc" : "asc");
                            setPage(0);
                          }}
                        >
                          {col.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedReceipts.map((r) => (
                    <TableRow
                      key={r.id}
                      hover
                      onClick={() => navigate(`/assign/${id}/${r.id}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{r.title}</TableCell>
                      <TableCell>{r.body?.slice(0, 60) || "—"}</TableCell>
                      <TableCell>{r.category || "—"}</TableCell>
                      <TableCell align="right">{fmtCurrency(Number(r.totalPay) || 0)}</TableCell>
                      <TableCell align="right">{fmtDate(r.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <TablePagination
                component="div"
                count={receipts.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Paper>
        )}
      </TabPanel>

      {/* === Leave dialog === */}
      <Dialog open={leaveOpen} onClose={() => setLeaveOpen(false)}>
        <DialogTitle>Leave this group?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            You’ll lose access to its receipts and assignments.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveOpen(false)}>Cancel</Button>
          <Button onClick={handleLeave} color="error" variant="contained" disabled={leaving}>
            {leaving ? "Leaving…" : "Leave group"}
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={removeOpen} onClose={() => setRemoveOpen(false)}>
        <DialogTitle>Remove member?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove{" "}
            <strong>
              {memberToRemove?.username ||
                [memberToRemove?.firstName, memberToRemove?.lastName].filter(Boolean).join(" ") ||
                memberToRemove?.email ||
                "this member"}
            </strong>{" "}
            from {groupName || "this group"}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmRemoveMember}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
}

export default GroupDetailPage;
