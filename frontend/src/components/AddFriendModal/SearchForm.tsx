import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  register,
  errors,
  loading,
  usernameValue,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold">
          Tìm kiếm bằng username
        </Label>
        <Input
          id="username"
          placeholder="Nhập tên người bạn cần tìm"
          className="glass border-border/50 focus:border-primary/50 transition-smooth"
          {...register("username", {
            required: "Vui lòng nhập username",
          })}
        ></Input>
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
        {isFound === false && (
          <div className="text-sm text-destructive">
            Không tìm thấy người dùng với username "
            <span className="font-semibold">{searchedUsername}</span>"
          </div>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="flex-1 glass hover:text-destructive"
            onClick={onCancel}
          >
            Đóng
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={loading || !usernameValue}
          className="flex-1 bg-primary text-white hover:opacity-90 transition-smooth"
        >
          {loading ? (
            <span>Đang tìm...</span>
          ) : (
            <>
              <Search className="size-5 mr-2" /> Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SearchForm;
