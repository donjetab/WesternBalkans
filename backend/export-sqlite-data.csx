#!/usr/bin/env dotnet-script
#r "nuget: Microsoft.Data.Sqlite, 8.0.0"
#r "nuget: System.Text.Json, 8.0.0"

using System;
using System.IO;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using System.Text.Json;

string dbPath = "edu4migration.db";
string outDir = "exported-data";
Directory.CreateDirectory(outDir);

var tables = new[] { "AdminUsers", "MediaAssets", "HomepageContents", "ContentPages", "ContentSections", "NewsItems" };

using var conn = new SqliteConnection($"Data Source={dbPath};");
conn.Open();

foreach (var table in tables)
{
    try
    {
        using var cmd = conn.CreateCommand();
        cmd.CommandText = $"SELECT * FROM [{table}]";

        using var reader = cmd.ExecuteReader();
        var rows = new List<Dictionary<string, object?>>();

        while (reader.Read())
        {
            var row = new Dictionary<string, object?>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                var name = reader.GetName(i);
                var value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                row[name] = value;
            }
            rows.Add(row);
        }

        var json = JsonSerializer.Serialize(rows, new JsonSerializerOptions { WriteIndented = true });
        var outPath = Path.Combine(outDir, table + ".json");
        File.WriteAllText(outPath, json);
        Console.WriteLine($"Exported {rows.Count} rows from {table} to {outPath}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Skipping {table}: {ex.Message}");
    }
}

conn.Close();
Console.WriteLine("Done.");
