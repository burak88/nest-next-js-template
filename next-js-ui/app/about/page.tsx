"use client";
import React, { useEffect } from "react";
import apiCall from "../services/apiCall";

export default async function AboutPage() {
  useEffect(() => {
    const fetchData = async () => {
      return await apiCall.get("/product");
    };
    fetchData();
  }, []);

  return <div>AboutPage</div>;
}
