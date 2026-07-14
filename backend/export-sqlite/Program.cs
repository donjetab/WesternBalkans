using System;
using System.IO;
using System.Collections.Generic;
using Microsoft.Data.Sqlite;
using System.Text.Json;

Console.WriteLine("Exporting SQLite data to JSON...");

string dbPath = "c:\\Users\\donjeta.bajgora\\Desktop\\edu4migration\\backend\\edu4migration.db";
dbPath = Path.GetFullPath(dbPath);
string outDir = Path.Combine(AppContext.BaseDirectory, "..", "..", "exported-data");
Directory.CreateDirectory(outDir);

using var conn = new SqliteConnection($"Data Source={dbPath};");
conn.Open();

// Discover tables in the SQLite database
var tables = new List<string>();
using (var tcmd = conn.CreateCommand())
{
	tcmd.CommandText = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";
	using var reader = tcmd.ExecuteReader();
	while (reader.Read())
	{
		tables.Add(reader.GetString(0));
	}
}

Console.WriteLine($"Found {tables.Count} tables: {string.Join(", ", tables)}");

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
