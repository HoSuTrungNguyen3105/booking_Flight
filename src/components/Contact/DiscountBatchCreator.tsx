import React, { useState, useCallback, Activity } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Plus, Trash } from "lucide-react";
import { nowDecimal } from "../../hooks/format";
import { ResponseCode } from "../../utils/response";
import { useCreateBatchDiscount } from "../../context/Api/FlightApi";
import InputTextField from "../../common/Input/InputTextField";
import InputNumber from "../../common/Input/InputNumber";
import DateTimePickerComponent from "../../common/DayPicker/index";

export interface CreateDiscountReq {
  code: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  isPercentage: boolean;
  active: boolean;
  usageLimit?: number;
  validFrom: number;
  validTo: number;
}

const DEFAULT_DISCOUNT: CreateDiscountReq = {
  code: "",
  description: "",
  discountAmount: 0,
  discountPercent: 0,
  isPercentage: false,
  active: true,
  usageLimit: 0,
  validFrom: nowDecimal(),
  validTo: Date.now() + 7 * 24 * 60 * 60 * 1000,
};

export const DiscountBatchCreator: React.FC = () => {
  const { refetchCreateBatchDiscount } = useCreateBatchDiscount();
  const [discounts, setDiscounts] = useState<CreateDiscountReq[]>([
    DEFAULT_DISCOUNT,
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (index: number, field: keyof CreateDiscountReq, value: any) => {
      setDiscounts((prev) =>
        prev.map((discount, i) =>
          i === index ? { ...discount, [field]: value } : discount
        )
      );
    },
    []
  );

  const handleAddDiscount = () =>
    setDiscounts((prev) => [...prev, DEFAULT_DISCOUNT]);

  const handleRemoveDiscount = (index: number) => {
    setDiscounts((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await refetchCreateBatchDiscount(discounts);
      if (res?.resultCode === ResponseCode.SUCCESS) {
        const errorMap: Record<number, string> = {};

        const newDiscounts = discounts.map((d, idx) => {
          const item = res.list?.[idx];

          if (item?.resultCode !== ResponseCode.SUCCESS) {
            errorMap[idx] = item?.resultCode || "Unknown error";
            return d;
          }
          return DEFAULT_DISCOUNT;
        });
        setDiscounts(newDiscounts);
        setErrors(errorMap);
        if (Object.keys(errorMap).length === 0) {
        } //onClose()
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Create Discount Codes in Bulk
      </Typography>

      {discounts.map((d, idx) => (
        <Card
          key={idx}
          sx={{ mb: 2, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <InputTextField
                  placeholder="Code"
                  value={d.code}
                  onChange={(e) => handleChange(idx, "code", e.toUpperCase())}
                  error={!!errors[idx]}
                />
              </Grid>
              <Grid size={3}>
                <InputTextField
                  placeholder="Description"
                  value={d.description}
                  onChange={(e) => handleChange(idx, "description", e)}
                />
              </Grid>
              <Grid size={3}>
                <Activity mode={d.isPercentage ? "hidden" : "visible"}>
                  <InputNumber
                    placeholder={
                      d.isPercentage ? "Discount (%)" : "Discount Amount"
                    }
                    value={d.discountAmount}
                    onChange={(e) =>
                      handleChange(
                        idx,
                        d.isPercentage ? "discountPercent" : "discountAmount",
                        Number(e)
                      )
                    }
                  />
                </Activity>
                <Activity mode={d.isPercentage ? "visible" : "hidden"}>
                  <InputNumber
                    placeholder={
                      d.isPercentage ? "Discount (%)" : "Discount Amount"
                    }
                    value={d.discountPercent}
                    onChange={(e) =>
                      handleChange(
                        idx,
                        d.isPercentage ? "discountPercent" : "discountAmount",
                        Number(e)
                      )
                    }
                  />
                </Activity>
              </Grid>
              <Grid size={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={d.isPercentage}
                      onChange={(e) =>
                        handleChange(idx, "isPercentage", e.target.checked)
                      }
                    />
                  }
                  label="Is Percentage"
                />
              </Grid>

              <Grid size={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={d.active}
                      onChange={(e) =>
                        handleChange(idx, "active", e.target.checked)
                      }
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid size={3}>
                <InputNumber
                  placeholder="Usage Limit"
                  value={d.usageLimit}
                  onChange={(e) => handleChange(idx, "usageLimit", Number(e))}
                />
              </Grid>
              <Grid size={3}>
                <DateTimePickerComponent
                  value={d.validFrom}
                  language="en"
                  onChange={(e) => handleChange(idx, "validFrom", e)}
                />
              </Grid>
              <Grid size={3}>
                <DateTimePickerComponent
                  value={d.validTo}
                  language="en"
                  onChange={(e) => handleChange(idx, "validTo", e)}
                />
              </Grid>

              <Grid size={12} display="flex" justifyContent="flex-end">
                <Button
                  color="error"
                  startIcon={<Trash size={16} />}
                  onClick={() => handleRemoveDiscount(idx)}
                  disabled={discounts.length === 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2} mt={2}>
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddDiscount}
        >
          Add Discount
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};
