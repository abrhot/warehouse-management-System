'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductHeader = void 0;
const react_1 = __importStar(require("react"));
const ProductHeader = ({ categories, onCategoryChange, onAvailabilityChange, }) => {
    const [categoryOpen, setCategoryOpen] = (0, react_1.useState)(false);
    const [availabilityOpen, setAvailabilityOpen] = (0, react_1.useState)(false);
    const availabilityOptions = ["All", "In Stock", "Out of Stock"];
    return (<div className="flex flex-wrap justify-between items-center gap-3 p-4 relative mb-4">
      <p className="text-[#141b0e] tracking-light text-[32px] font-bold leading-tight min-w-72">
        Product Management
      </p>

      <div className="flex gap-3 flex-wrap relative z-10">
        {/* Category Button */}
        <div className="relative">
          <button onClick={() => {
            setCategoryOpen((prev) => !prev);
            setAvailabilityOpen(false);
        }} className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium">
            Category ⌄
          </button>
          {categoryOpen && (<div className="absolute top-full right-0 mt-1 bg-white border rounded-xl shadow-md w-48 text-sm">
              {categories.map((cat) => (<button key={cat} onClick={() => {
                    onCategoryChange(cat);
                    setCategoryOpen(false);
                }} className="w-full text-left px-4 py-2 hover:bg-[#edf3e8] text-[#141b0e]">
                  {cat}
                </button>))}
            </div>)}
        </div>

        {/* Availability Button */}
        <div className="relative">
          <button onClick={() => {
            setAvailabilityOpen((prev) => !prev);
            setCategoryOpen(false);
        }} className="flex h-8 items-center gap-2 rounded-xl bg-[#edf3e8] pl-4 pr-2 text-sm text-[#141b0e] font-medium">
            Availability ⌄
          </button>
          {availabilityOpen && (<div className="absolute top-full right-0 mt-1 bg-white border rounded-xl shadow-md w-40 text-sm">
              {availabilityOptions.map((status) => (<button key={status} onClick={() => {
                    onAvailabilityChange(status);
                    setAvailabilityOpen(false);
                }} className="w-full text-left px-4 py-2 hover:bg-[#edf3e8] text-[#141b0e]">
                  {status}
                </button>))}
            </div>)}
        </div>
      </div>
    </div>);
};
exports.ProductHeader = ProductHeader;
